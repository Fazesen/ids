import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.save_features import save_feature_vector
from backend.flow_manager import FlowManager
from backend.attack_detector import classify_attack
from scapy.all import sniff, IP, TCP, UDP
import time
import socketio

# --------------------------------------------
# WebSocket: Connect to Node.js Dashboard
# --------------------------------------------
sio = socketio.Client()
try:
    sio.connect("http://localhost:5000")
    print("✅ WebSocket connected to Dashboard")
except Exception as e:
    print("⚠ Could not connect to Dashboard WebSocket:", e)

def emit_alert(alert):
    """Send attack alert to Node.js dashboard via WebSocket"""
    try:
        sio.emit("new_alert", alert)
        print("📡 Alert sent to dashboard")
    except Exception as e:
        print("⚠ Failed to send alert:", e)


# --------------------------------------------
# Flow Manager + Logging
# --------------------------------------------
fm = FlowManager()
last_normal_log = 0
NORMAL_LOG_INTERVAL = 10   # print normal message every 10 sec


# --------------------------------------------
# Main packet handler
# --------------------------------------------
def process_packet(packet):
    global last_normal_log

    if IP not in packet:
        return

    src = packet[IP].src
    dst = packet[IP].dst
    length = len(packet)
    ttl = packet[IP].ttl

    sport = dport = None
    flags = None

    # Determine protocol details
    if TCP in packet:
        sport = packet[TCP].sport
        dport = packet[TCP].dport
        flags = packet[TCP].flags

    elif UDP in packet:
        sport = packet[UDP].sport
        dport = packet[UDP].dport

    # Determine direction (IMPORTANT!)
    direction = "src"

    if packet[IP].src != src:
        direction = "dst"

    # -------- Update flow with UNSW-style metrics --------
    fm.update_flow(
        src, dst, sport, dport,
        length, flags,
        ttl, direction
    )

    key = (src, dst, sport, dport)

    # Extract flow features
    features = fm.get_feature_vector(key)

    # -------- AI ATTACK CLASSIFICATION --------
    attack_type = classify_attack(features)

    if attack_type != "Normal":

        # -------------------------------------
        # SEND ALERT TO DASHBOARD
        # -------------------------------------
        alert_data = {
            "timestamp": time.time(),
            "type": attack_type,
            "severity": "high",  # can refine per category
            "src": f"{src}:{sport}",
            "dst": f"{dst}:{dport}",
            "protocol": "TCP" if TCP in packet else "UDP",
            "confidence": 0.92
        }

        emit_alert(alert_data)

        # Local console print
        print("\n[**] [ATTACK DETECTED] [**]")
        print(f"Type : {attack_type}")
        print(f"Src  : {src}:{sport}")
        print(f"Dst  : {dst}:{dport}")
        print("------------------------------------------------------\n")

    else:
        now = time.time()
        if now - last_normal_log >= NORMAL_LOG_INTERVAL:
            print("[OK] Traffic normal…")
            last_normal_log = now

    # Save feature vector to file
    save_feature_vector(features)


# --------------------------------------------
# Start sniffing packets
# --------------------------------------------
sniff(prn=process_packet, store=False)

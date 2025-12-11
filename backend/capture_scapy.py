from scapy.all import sniff, IP, TCP, UDP
import time

def packet_callback(packet):
    if IP in packet:
        data = {
            "timestamp": time.time(),
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "length": len(packet),
        }

        if TCP in packet:
            data["sport"] = packet[TCP].sport
            data["dport"] = packet[TCP].dport
            data["flags"] = packet[TCP].flags
        elif UDP in packet:
            data["sport"] = packet[UDP].sport
            data["dport"] = packet[UDP].dport

        print(data)

sniff(prn=packet_callback, store=False)

import pyshark

cap = pyshark.LiveCapture(interface="Wi-Fi")  # change interface if needed

for packet in cap.sniff_continuously():
    try:
        print({
            "timestamp": packet.sniff_time,
            "layers": packet.layers,
            "highest_layer": packet.highest_layer,
            "length": packet.length
        })
    except:\
        pass
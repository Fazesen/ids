from collections import defaultdict
import time
import math

class FlowManager:
    def __init__(self):
        self.flows = defaultdict(lambda: {
            "start_time": None,
            "end_time": None,

            # Basic stats
            "packet_count": 0,
            "bytes": 0,
            "packet_sizes": [],
            "timestamps": [],

            # Directional stats
            "spkts": 0,
            "dpkts": 0,
            "sbytes": 0,
            "dbytes": 0,

            # TTL metrics
            "sttl": None,
            "dttl": None,

            # TCP handshake timing
            "syn_time": None,
            "synack_time": None,
            "ack_time": None,

            # Flags
            "flags": [],
        })

    # -------------------------------------------------------
    # UPDATE FLOW
    # -------------------------------------------------------
    def update_flow(self, src, dst, sport, dport, length, flags, ttl=None, direction="src"):
        key = (src, dst, sport, dport)
        flow = self.flows[key]
        now = time.time()

        if flow["start_time"] is None:
            flow["start_time"] = now

        flow["end_time"] = now
        flow["packet_count"] += 1
        flow["bytes"] += length
        flow["packet_sizes"].append(length)
        flow["timestamps"].append(now)

        # Directional stats
        if direction == "src":
            flow["spkts"] += 1
            flow["sbytes"] += length
            if flow["sttl"] is None and ttl is not None:
                flow["sttl"] = ttl
        else:
            flow["dpkts"] += 1
            flow["dbytes"] += length
            if flow["dttl"] is None and ttl is not None:
                flow["dttl"] = ttl

        # TCP handshake tracking
        if flags:
            f = str(flags)
            flow["flags"].append(f)

            if "S" in f and flow["syn_time"] is None:
                flow["syn_time"] = now
            if "SA" in f and flow["synack_time"] is None:
                flow["synack_time"] = now
            if "A" in f and flow["ack_time"] is None:
                flow["ack_time"] = now

    # -------------------------------------------------------
    # EXTRACT FEATURE VECTOR
    # -------------------------------------------------------
    def get_feature_vector(self, key):
        f = self.flows[key]

        duration = max(f["end_time"] - f["start_time"], 0.0001)

        # Inter-arrival times
        ts = f["timestamps"]
        iats = [ts[i] - ts[i - 1] for i in range(1, len(ts))]

        # RTT metrics
        synack = 0
        ackdat = 0
        if f["syn_time"] and f["synack_time"]:
            synack = f["synack_time"] - f["syn_time"]
        if f["synack_time"] and f["ack_time"]:
            ackdat = f["ack_time"] - f["synack_time"]

        # Compute UNSW-style load & jitter
        sload = f["sbytes"] / duration
        dload = f["dbytes"] / duration
        sinpkt = f["spkts"] / duration
        dinpkt = f["dpkts"] / duration
        sjit = (max(iats) - min(iats)) if len(iats) > 1 else 0

        # tcprtt = full handshake RTT if available
        tcprtt = 0
        if f["syn_time"] and f["ack_time"]:
            tcprtt = f["ack_time"] - f["syn_time"]

        # UNSW FEATURE SET OUTPUT
        return {
            "dur": duration,
            "spkts": f["spkts"],
            "dpkts": f["dpkts"],
            "sbytes": f["sbytes"],
            "dbytes": f["dbytes"],
            "sttl": f["sttl"] or 0,
            "dttl": f["dttl"] or 0,
            "sload": sload,
            "dload": dload,
            "sinpkt": sinpkt,
            "dinpkt": dinpkt,
            "sjit": sjit,
            "djit": 0,
            "tcprtt": tcprtt,
            "synack": synack,
            "ackdat": ackdat
        }

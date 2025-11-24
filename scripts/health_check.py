#!/usr/bin/env python3
"""
Quick health-check script for all Java backend services.

Usage:
    python scripts/health_check.py

Env overrides:
    HEALTH_HOST    Base host (default: localhost)
    HEALTH_TIMEOUT Request timeout in seconds (default: 6)
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from typing import Iterable, List, Tuple


def fetch(url: str, timeout: float) -> Tuple[bool, str]:
    """Fetch URL and return (success, message)."""
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            body = resp.read()
            status = resp.getcode()
            if body:
                try:
                    data = json.loads(body.decode("utf-8"))
                    # Prefer nested "status" when present (Spring Actuator)
                    msg = data.get("status") or str(data)
                except Exception:
                    msg = body.decode("utf-8", errors="replace").strip()
            else:
                msg = ""
            return 200 <= status < 300, f"{status} {msg}"
    except urllib.error.HTTPError as exc:  # keep response body for debugging
        detail = exc.read().decode("utf-8", errors="replace") if hasattr(exc, "read") else str(exc)
        return False, f"HTTP {exc.code}: {detail}"
    except Exception as exc:
        return False, str(exc)


def check_service(name: str, endpoints: Iterable[str], timeout: float) -> Tuple[bool, str]:
    """Try endpoints in order until one succeeds."""
    for url in endpoints:
        ok, msg = fetch(url, timeout)
        if ok:
            return True, f"OK via {url} -> {msg}"
    return False, f"FAILED. Tried: {', '.join(endpoints)}"


def main() -> int:
    host = os.getenv("HEALTH_HOST", "localhost").rstrip("/")
    timeout = float(os.getenv("HEALTH_TIMEOUT", "6"))

    services: List[Tuple[str, List[str]]] = [
        ("eureka", [f"http://{host}:8761/actuator/health", f"http://{host}:8761/health"]),
        ("api-gateway", [f"http://{host}:8181/actuator/health", f"http://{host}:8181/health"]),
        ("identity-service", [f"http://{host}:8082/actuator/health", f"http://{host}:8082/health"]),
        ("user-profile-service", [f"http://{host}:8083/health", f"http://{host}:8083/actuator/health"]),
        ("course-service", [f"http://{host}:8084/api/v1/health", f"http://{host}:8084/actuator/health"]),
        ("dashboard-service", [f"http://{host}:8085/health", f"http://{host}:8085/actuator/health"]),
        ("assessment-service", [f"http://{host}:8086/health", f"http://{host}:8086/actuator/health"]),
    ]

    print(f"Checking services via host '{host}' with timeout={timeout}s")
    failures = 0
    start = time.time()
    for name, urls in services:
        ok, msg = check_service(name, urls, timeout)
        status = "✅" if ok else "❌"
        print(f"{status} {name}: {msg}")
        if not ok:
            failures += 1

    elapsed = time.time() - start
    print(f"\nDone in {elapsed:.1f}s. Failures: {failures}")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())

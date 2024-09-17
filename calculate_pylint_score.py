import sys
import re


def calculate_pylint_score(pylint_output):
    total_lines = 0
    compliant_lines = 0

    for line in pylint_output.splitlines():
        if re.match(r'^(\d+):\d+: .*', line):  # A basic pattern to match pylint output lines
            total_lines += 1
        if "convention" in line and "refactor" in line and "warning" not in line:
            compliant_lines += 1

    if total_lines == 0:
        return 100.0

    score = (compliant_lines / total_lines) * 100
    return score


if __name__ == "__main__":
    pylint_output = sys.stdin.read()
    score = calculate_pylint_score(pylint_output)
    print(f"Pylint adherence score: {score:.2f}%")

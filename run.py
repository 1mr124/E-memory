#!/home/mr124/PyEnv/E-Memory/bin/python3

import sys
from FlaskSite import createApp

def getRunConfiguration():
    """Determine the run configuration based on command-line arguments."""
    return len(sys.argv) == 2

def main():
    """Main entry point for the script."""
    app = createApp()
    runConfig = getRunConfiguration()
    
    if runConfig:
        # Run the app globally on LAN
        app.run(host="0.0.0.0", port=5000, debug=False)
    else:
        # Run the app on localhost with debug mode off
        print("Local")
        app.run(debug=True,port=5001)

if __name__ == '__main__':
    main()

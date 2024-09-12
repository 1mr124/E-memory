#!/home/mr124/PyEnv/E-Memory/bin/python3

from FlaskSite import app
from sys import argv # to take input arguments from script 

# run it Global in Lan if you gave it any two input arguments
if len(argv) ==2:
	root = True
else:
	root = False

if __name__ == '__main__':
	if root:
		app.run(host="0.0.0.0",port=5000,debug=False) # this Option to run it in your Local Lan
	else:
		app.run(debug=False) # run it on localhost with debug mode off


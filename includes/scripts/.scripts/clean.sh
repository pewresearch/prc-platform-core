#!/bin/bash

# Start at the /src directory
cd src || exit

# Find all directories that contain a src/*/package.json file
for dir in $(find ./@prc -mindepth 1 -maxdepth 1 -type d -exec test -e '{}/package.json' ';' -print); do
    # Go to the directory
    cd $dir || exit
	## Check for node_modules
	# Delete the node_modules directory
	if [ ! -d "node_modules" ]; then
		echo "Deleting node_modules in $dir"
	rm -rf node_modules
	fi
    # Go back to the /src directory
    cd - || exit
done

# Find all directories that contain a src/*/package.json file
for dir in $(find ./third-party -mindepth 1 -maxdepth 1 -type d -exec test -e '{}/package.json' ';' -print); do
    # Go to the directory
    cd $dir || exit
	## Check for node_modules
	# Delete the node_modules directory
	if [ ! -d "node_modules" ]; then
		echo "Deleting node_modules in $dir"
	rm -rf node_modules
	fi
    # Go back to the /src directory
    cd - || exit
done

#!/bin/bash
echo "Running build all script"
echo "This will clear the node_modules and package-lock.json files and run npm install AND npm build in all the directories that contain a src/&/package.json file, a fresh start for all the scripts."
# Start at the /src directory
cd src || exit

# Loop through all the directories in /@prc that have a package.json, so /@prc/*/package.json
for dir in $(find ./@prc -mindepth 1 -maxdepth 1 -type d -exec test -e '{}/package.json' ';' -print); do
	echo "Building..."
	echo "$dir..."
	# Go to the directory
	cd $dir || exit

	### Check for package-lock.json and if exists delete it
	if [ -f "package-lock.json" ]; then
		echo "Deleting package-lock.json in $dir"
		rm package-lock.json
	fi
	## Check for node_modules
	if [ ! -d "node_modules" ]; then
		echo "Running npm install in $dir"
		npm install
	fi
	# Run npm build
	echo "Running npm build in $dir"
	npm run build
	# Delete the node_modules directory
	# We delete the node_modules directory because they're large, clean up as we go.
	echo "Deleting node_modules in $dir"
	rm -rf node_modules
	# Go back to the /src directory
	cd - || exit
done

# Loop through all the directories in /third-pary that have a package.json, so /third-party/*/package.json
for dir in $(find ./third-party -mindepth 1 -maxdepth 1 -type d -exec test -e '{}/package.json' ';' -print); do
	echo "Building..."
	echo "third-party scripts..."
	# Go to the directory
    cd $dir || exit

	### Check for package-lock.json and if exists delete it
	if [ -f "package-lock.json" ]; then
		echo "Deleting package-lock.json in $dir"
		rm package-lock.json
	fi
	## Check for node_modules
	if [ ! -d "node_modules" ]; then
		echo "Running npm install in $dir"
		npm install
	fi
    # Run npm build
    echo "Running npm build in $dir"
    npm run build
	# Delete the node_modules directory
	# We delete the node_modules directory because they're large, clean up as we go.
	echo "Deleting node_modules in $dir"
	rm -rf node_modules
    # Go back to the /src directory
    cd - || exit
done

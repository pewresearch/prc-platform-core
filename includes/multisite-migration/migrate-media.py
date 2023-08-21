import os
import shutil

# Define the source and destination directories
src_base_dir = 'uploads'
dst_base_dir = 'uploads/sites/20'

# Create the destination directory if it doesn't exist
if not os.path.exists(dst_base_dir):
	os.makedirs(dst_base_dir)

# Loop through each year directory under the source base directory
for year_dir in os.listdir(src_base_dir):
	if year_dir.isdigit() and len(year_dir) == 4:
		year_path = os.path.join(src_base_dir, year_dir)
		if os.path.isdir(year_path):
			# Create the year directory in the destination base directory
			dst_year_dir = os.path.join(dst_base_dir, year_dir)
			if not os.path.exists(dst_year_dir):
				os.makedirs(dst_year_dir)

			# Loop through each subfolder under the year directory
			for subfolder_name in os.listdir(year_path):
				subfolder_path = os.path.join(year_path, subfolder_name)
				if (
					os.path.isdir(subfolder_path) and
					subfolder_name != 'sites'  # Skip copying from sites/ folder
				):
					# Create a new subdirectory with the same name under the destination year directory
					dst_subfolder_dir = os.path.join(dst_year_dir, subfolder_name)
					if not os.path.exists(dst_subfolder_dir):
						os.makedirs(dst_subfolder_dir)

					# Copy all files in the subfolder to the new destination subdirectory
					for filename in os.listdir(subfolder_path):
						src_file = os.path.join(subfolder_path, filename)
						dst_file = os.path.join(dst_subfolder_dir, filename)
						try:
							shutil.copy2(src_file, dst_file)
						except IsADirectoryError:
							# Skip over directories and continue processing files
							pass

# Loop through each subfolder under the source sites directory
src_sites_dir = os.path.join(src_base_dir, 'sites')
for site_dir in os.listdir(src_sites_dir):
	site_path = os.path.join(src_sites_dir, site_dir)
	if os.path.isdir(site_path) and site_dir != '20':  # Skip the sites/20 folder
		# Loop through each subfolder under the site directory
		for year_dir in os.listdir(site_path):
			year_path = os.path.join(site_path, year_dir)
			if os.path.isdir(year_path):
				# Loop through each subfolder under the year directory
				for month_dir in os.listdir(year_path):
					month_path = os.path.join(year_path, month_dir)
					if os.path.isdir(month_path):
						# Create a new subdirectory for the year/month combination under the destination directory
						dst_subdir = os.path.join(dst_base_dir, year_dir, month_dir)
						if not os.path.exists(dst_subdir):
							os.makedirs(dst_subdir)

						# Copy all files in the month directory to the new subdirectory
						for filename in os.listdir(month_path):
							src_file = os.path.join(month_path, filename)
							dst_file = os.path.join(dst_subdir, filename)
							try:
								shutil.copy2(src_file, dst_file)
							except IsADirectoryError:
								# Skip over directories and continue processing files
								pass

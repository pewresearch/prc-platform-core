import os
import shutil

# Define the source and destination directories
src_dir = 'uploads/sites'
dst_dir = 'uploads/sites/20'

# Create the destination directory if it doesn't exist
if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

# Loop through each subfolder under the source directory
for site_dir in os.listdir(src_dir):
    site_path = os.path.join(src_dir, site_dir)
    if os.path.isdir(site_path):
        # Loop through each subfolder under the site directory
        for year_dir in os.listdir(site_path):
            year_path = os.path.join(site_path, year_dir)
            if os.path.isdir(year_path):
                # Loop through each subfolder under the year directory
                for month_dir in os.listdir(year_path):
                    month_path = os.path.join(year_path, month_dir)
                    if os.path.isdir(month_path):
                        # Create a new subdirectory for the year/month combination under the destination directory
                        dst_subdir = os.path.join(dst_dir, year_dir, month_dir)
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

import os
import json

# Specify the folder path containing the images
folder_path = '../imgs'

# Function to extract u and v from the image filename
def extract_u_v(filename):
    _, _, _, u, v, _ = filename[:-4].split('_')
    return u, v

# List to store image information
image_info_list = []

# Iterate through each file in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".png") and "out_" in filename:
        # Extract file name, u, and v
        file_name = filename
        u, v = extract_u_v(filename)

        # Add information to the list
        image_info_list.append({
            "src": file_name,
            "u": u,
            "v": v
        })

# Create a JSON file with the image information
json_file_path = '../imgs/imgs.json'
with open(json_file_path, 'w') as json_file:
    json.dump(image_info_list, json_file, indent=2)

print(f'JSON file created: {json_file_path}')


import pandas as pd

# Define the input Excel file path and output CSV file path
excel_file_path = '/Users/3shimi/Projects/Pickle/Pickleball Courts.xlsx'
csv_file_path = '/Users/3shimi/Projects/Pickle/Pickleball Courts.csv'

try:
    # Read the Excel file into a pandas DataFrame
    # Assuming the data is in the first sheet (index 0)
    df = pd.read_excel(excel_file_path, sheet_name=0)

    # Write the DataFrame to a CSV file
    # index=False prevents pandas from writing row indices into the CSV
    # encoding='utf-8-sig' ensures proper handling of Chinese characters and BOM for Excel compatibility
    df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')

    print(f"Successfully converted '{excel_file_path}' to '{csv_file_path}'")

except FileNotFoundError:
    print(f"Error: The file '{excel_file_path}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")
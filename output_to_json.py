import json
from datetime import datetime

def output_to_json(file_path):
  with open(file_path, "r") as file:
    content = file.read()

  entries = content.strip().split("\n\n")

  results = []
  for entry in entries:
    properties_dict = json.loads(entry)

    # separate Date Range into Start Date and End Date
    if "Date Range" in properties_dict:
      date_range = properties_dict.pop("Date Range")
      if " to " in date_range:
        start_date, end_date = date_range.split(" to ")
      else:
        start_date = date_range
        end_date = start_date
      properties_dict["Start Date"] = start_date
      properties_dict["End Date"] = end_date

      # skip entry if End Date is in the past
      end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
      if end_date_obj < datetime.now():
        continue

    results.append(properties_dict)

  return results

def main():
  file_path = "output.txt"
  data = output_to_json(file_path)
  with open("vacations.json", "w") as json_file:
    json.dump(data, json_file, indent=2)

if __name__ == "__main__":
  main()

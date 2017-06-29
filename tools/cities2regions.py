import csv
import json
import os

"""
This script converts the list of french cities to a list of regions with their lat/lng corresponding to their department number.

    curl -o cities.json "http://api.geonames.org/search?username=vperron&country=FR&featureCode=PPLA&featureCode=PPLC&featureCode=PPLA2&style=FULL&type=json"

        {
            "adminCode1": "11",
            "adminCode2": "75",
            "adminCode3": "751",
            "adminCode4": "75056",
            "adminId1": "3012874",
            "adminId2": "2968815",
            "adminId3": "2988506",
            "adminId4": "6455259",
            "adminName1": "\u00cele-de-France",
            "adminName2": "Paris",
            "adminName3": "Paris",
            "adminName4": "Paris",
            "adminName5": "",
            "asciiName": "Paris",
            "bbox": {
                "accuracyLevel": 2,
                "east": 2.638397091854524,
                "north": 49.043237783289044,
                "south": 48.66358221671095,
                "west": 2.0592029081454766
            },
            "continentCode": "EU",
            "countryCode": "FR",
            "countryId": "3017382",
            "countryName": "France",
            "fcl": "P",
            "fclName": "city, village,...",
            "fcode": "PPLC",
            "fcodeName": "capital of a political entity",
            "geonameId": 2988507,
            "lat": "48.85341",
            "lng": "2.3488",
            "name": "Paris",
            "population": 2138551,
            "score": 171.6454315185547,
            "timezone": {
                "dstOffset": 2,
                "gmtOffset": 1,
                "timeZoneId": "Europe/Paris"
            },
            "toponymName": "Paris"
        },
"""

with open('cities.json', 'r') as f:
    data = json.loads(f.read())['geonames']


with open('regions.csv', 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=['region', 'lat', 'lng'])
    writer.writeheader()
    for row in data:
        if 'adminCode2' not in row:
            print("No admin code for city:", row['name'])
            continue

        writer.writerow({
            'region': row['adminCode2'],
            'lat': row['lat'],
            'lng': row['lng'],
        })

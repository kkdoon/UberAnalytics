import os
import csv
import datetime

dirName = "data"

def process(pickUp, dropOff):
	#return [pickUp[0][1:-1], dropOff[0][1:-1], pickUp[1], pickUp[2], dropOff[1], dropOff[2]]
	sDate = datetime.datetime.strptime(pickUp[0][1:-1], '%m/%d/%Y %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%SZ')
	eDate = datetime.datetime.strptime(dropOff[0][1:-1], '%m/%d/%Y %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%SZ')
	return "{ startTime: { $date: \"" + sDate + "\"}, endTime: { $date: \"" + eDate + "\"}, dropdownPoint: { type: \"Point\", coordinates: [" + dropOff[2] + "," + dropOff[1] + "] }, pickupPoint: { type: \"Point\", coordinates: [" + pickUp[2] + "," + pickUp[1] + "] }, tripPoints:{ type: \"LineString\", coordinates: [[" + pickUp[2] + "," + pickUp[1] + "], [" + dropOff[2] + "," + dropOff[1] + "]]}}"

def processData():
	with open("processed.json", 'wb') as out_file:
		#writer = csv.writer(out_file)

		for filename in os.listdir(dirName):
			with open(dirName + "/" + filename, 'rb') as in_file:
				try:
					flag = True
					spamreader = csv.reader(in_file, delimiter=',', quotechar='|', skipinitialspace=True)
					pickup1 = None
					pickup2 = None
					dropOff1 = None
					for row in spamreader:
						try:
							if flag:
								flag = False
								continue

							if pickup1 is None:
								pickup1 = row
							elif pickup2 is None:
								pickup2 = row
							elif dropOff1 is None:
								dropOff1 = row
							else:
								#writer.writerow(process(pickup1, dropOff1))
								out_file.write(process(pickup1, dropOff1) + "\n")
								out_file.write(process(pickup2, row) + "\n")
								#writer.writerow(process(pickup2, row))
								pickup1 = None
								pickup2 = None
								dropOff1 = None
						except:
							continue
				except:
					continue



processData()
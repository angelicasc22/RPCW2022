import sys
import json

x = open("./arq-son-EVO.json")
jsonObj =  json.load(x) #json file to python dict
i = 0

for item in jsonObj['musicas']:
    item.setdefault('id',i)
    i+=1
    #print(item)

with open('./arq-son-EVO.json','w') as f:
   json.dump(jsonObj, f ,indent = 4,ensure_ascii=False)

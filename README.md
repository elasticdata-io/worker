# Heart of a data scraper

## Development

### Local

#### Run project 

```
npm run start:debug
```

or 

```
npm run start
```

## Invoke dsl 

```
POST 
http://localhost:3000
BODY:
{
	"commands": [
		{
			"cmd": "openurl",
			"link": "https://stackoverflow.com/questions/50675573/how-to-execute-a-js-function-on-the-page-while-automating-in-puppeteer"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key1"
		},
		{
			"cmd": "geturl"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key2"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key3"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key4"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key5"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key6"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key7"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key8"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key9"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key10"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right",
			"key": "key11"
		}
	]
}
```

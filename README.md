# D3-Area-Range-Line-Plugin

## Getting Started

Include `jtv.arearange.line.css`,`d3.v3.min.js` and`jtv.arearange.line.js` in your HTML. 

```HTML
<link href="css/jtv.arearange.line.css" rel="stylesheet">
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="js/jtv.arearange.line.js"></script>
```
Provide JSON data for plotting

```javascript
var retdata = [
                {
                    key: "Reg User",
                    values: [
                        {"date": "20101001", "low": 3, "high": 5, "avg": 4},
                        {"date": "20101002", "low": 6, "high": 8, "avg": 7},
                        {"date": "20101003", "low": 4, "high": 6, "avg": 5},
                        {"date": "20101004", "low": 6, "high": 8, "avg": 7},
                        {"date": "20101005", "low": 5, "high": 7, "avg": 6}
                        
                    ]
                },
                {
                    key: "Guest User",
                    values: [
                        {"date": "20101001", "low": 6, "high": 8, "avg": 7},
                        {"date": "20101002", "low": 3, "high": 5, "avg": 4},
                        {"date": "20101003", "low": 5, "high": 7, "avg": 6},
                        {"date": "20101004", "low": 2, "high": 4, "avg": 3},
                        {"date": "20101005", "low": 6, "high": 8, "avg": 7}
                        
                    ]
                }
            ];     
```

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const csv = require('csv-parser');
const { request } = require('http');
  
var template = {
  HTML:function templateHTML(title,list,body,control){
    var template = `
    <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}

li {
    float: left;
}

li a, .dropbtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

li a:hover, .dropdown:hover .dropbtn {
    background-color: rgba(255, 0, 0, 0.445);
}

li.dropdown {
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>
</head>
<body>

<ul>
  <li><a href="/home">Home</a></li>
  <li><a href="/news">News</a></li>
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn">HMM(HiddenMarkovModel)</a>
    <div class="dropdown-content">
      <a href="/?id=state1">state</a>
      <a href="/?id=oven">oven</a>
      <a href="/?id=refg">refg</a>
      <a href="/?id=kitchen">kitchen</a>
      <a href="/?id=light">light</a>
      <a href="/?id=all">all</a>
    </div>
  </li>
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn">LSTM(Long Short-Term Memory))</a>
    <div class="dropdown-content">
      <a href="/?id=state">state</a>
      <a href="/?id=oven">oven</a>
      <a href="/?id=refg">refg</a>
      <a href="/?id=kitchen">kitchen</a>
      <a href="/?id=light">light</a>
      <a href="/?id=all2">all</a>
    </div>
  </li>
</ul>
      <h3>
          ${control}
      <h2>${title}</h2>
      <p>${body}
      </p>
    </body>
    </html>
        `;
        return template;
},
graph_single:function graph_single(title,description_single){

  var description = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Line_Controls_Chart</title>
 
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <!-- google charts -->
       <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  </head>
  <body>
 
    <h4>power consuming</h4>
 
    <div id="Line_Controls_Chart">
      <!-- 라인 차트 생성할 영역 -->
          <div id="lineChartArea" style="padding:0px 20px 0px 0px;"></div>
      <!-- 컨트롤바를 생성할 영역 -->
          <div id="controlsArea" style="padding:0px 20px 0px 0px;"></div>
        </div>
 
  </body>
 
  <script>
 
  var chartDrowFun = {
    
 
    chartDrow : function(){
        var chartData = '';
        var list_main= [${description_single}];
        

        //날짜형식 변경하고 싶으시면 이 부분 수정하세요.
        var chartDateformat     = 'yyyy년MM월dd일hh시간mm분ss초';
        //라인차트의 라인 수
        var chartLineCount    = 10;
        //컨트롤러 바 차트의 라인 수
        var controlLineCount    = 10;
        
 
 
        function drawDashboard() {
 
          var data = new google.visualization.DataTable();
          //그래프에 표시할 컬럼 추가
          data.addColumn('datetime' , 'time');
          data.addColumn('number'   , '${title}');
           
          //그래프에 표시할 데이터
          var dataRow = [];
 
          for(var i = 0; i <= list_main.length; i++){ //랜덤 데이터 생성
            dataRow = [new Date('2017', '09', '10' , '1','0',3*i),  list_main[i]];
            data.addRow(dataRow);
          }
 
 
            var chart = new google.visualization.ChartWrapper({
              chartType   : 'LineChart',
              containerId : 'lineChartArea', //라인 차트 생성할 영역
              options     : {
                              isStacked   : 'percent',
                              focusTarget : 'category',
                              height          : 500,
                              width              : '100%',
                              legend          : { position: "top", textStyle: {fontSize: 13}},
                              pointSize        : 5,
                              tooltip          : {textStyle : {fontSize:12}, showColorCode : true,trigger: 'both'},
                              hAxis              : {format: chartDateformat, gridlines:{count:chartLineCount,units: {
                                                                  years : {format: ['yyyy년']},
                                                                  months: {format: ['MM월']},
                                                                  days  : {format: ['dd일']},
                                                                  hours : {format: ['HH시']},
                                                                  minutes : {format:['mm분']},
                                                                  seconds : {format:['ss초']}
                                                                }
                                                                },textStyle: {fontSize:12}},
                vAxis              : {minValue: 3,viewWindow:{min:0},gridlines:{count:-1},textStyle:{fontSize:12}},
                animation        : {startup: true,duration: 1000,easing: 'in' },
                annotations    : {pattern: chartDateformat,
                                textStyle: {
                                fontSize: 15,
                                bold: true,
                                italic: true,
                                color: '#871b47',
                                auraColor: '#d799ae',
                                opacity: 0.8,
                                pattern: chartDateformat
                              }
                            }
              }
            });
 
            var control = new google.visualization.ControlWrapper({
              controlType: 'ChartRangeFilter',
              containerId: 'controlsArea',  //control bar를 생성할 영역
              options: {
                  ui:{
                        chartType: 'LineChart',
                        chartOptions: {
                        chartArea: {'width': '60%','height' : 80},
                          hAxis: {'baselineColor': 'none', format: chartDateformat, textStyle: {fontSize:12},
                            gridlines:{count:controlLineCount,units: {
                                  years : {format: ['yyyy년']},
                                  months: {format: ['MM월']},
                                  days  : {format: ['dd일']},
                                  hours : {format: ['HH시']},
                                  minutes : {format:['mm분']},
                                  seconds : {format:['ss초']}
                                }
                            }}
                        }
                  },
                    filterColumnIndex: 0
                }
            });
 
            var date_formatter = new google.visualization.DateFormat({ pattern: chartDateformat});
            date_formatter.format(data, 0);
 
            var dashboard = new google.visualization.Dashboard(document.getElementById('Line_Controls_Chart'));
            window.addEventListener('resize', function() { dashboard.draw(data); }, false); //화면 크기에 따라 그래프 크기 변경
            dashboard.bind([control], [chart]);
            dashboard.draw(data);
 
        }
          google.charts.setOnLoadCallback(drawDashboard);
 
      }
    }
 
$(document).ready(function(){
  google.charts.load('current', {'packages':['line','controls']});
  chartDrowFun.chartDrow(); //chartDrow() 실행
});
  </script>
</html>

  
  `
  return description;
},
graph_multi:function graph_multi(description_stove,description_micro,description_garb,description_kitchen,description_refg){

  var description = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Line_Controls_Chart</title>
 
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <!-- google charts -->
       <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  </head>
  <body>
 
    <h4>power consuming</h4>
 
    <div id="Line_Controls_Chart">
      <!-- 라인 차트 생성할 영역 -->
          <div id="lineChartArea" style="padding:0px 20px 0px 0px;"></div>
      <!-- 컨트롤바를 생성할 영역 -->
          <div id="controlsArea" style="padding:0px 20px 0px 0px;"></div>
        </div>
 
  </body>
 
  <script>
 
  var chartDrowFun = {
    
 
    chartDrow : function(){
        var chartData = '';
        var list_kitchen= [${description_kitchen}];
        var list_stove= [${description_stove}];
        var list_micro= [${description_micro}];
        var list_refg= [${description_refg}];
        var list_garb=[${description_garb}];
        

        //날짜형식 변경하고 싶으시면 이 부분 수정하세요.
        var chartDateformat     = 'yyyy년MM월dd일hh시간mm분ss초';
        //라인차트의 라인 수
        var chartLineCount    = 10;
        //컨트롤러 바 차트의 라인 수
        var controlLineCount    = 10;
        
 
 
        function drawDashboard() {
 
          var data = new google.visualization.DataTable();
          //그래프에 표시할 컬럼 추가
          data.addColumn('datetime' , 'time');
          data.addColumn('number'   , 'stove');
          data.addColumn('number'   , 'microwave');
          data.addColumn('number'   , 'garbage');
          data.addColumn('number'   , 'kitchen');
          data.addColumn('number'   , 'refg');
           
          //그래프에 표시할 데이터
          var dataRow = [];
 
          for(var i = 0; i <= list_kitchen.length; i++){ //랜덤 데이터 생성
            dataRow = [new Date('2017', '09', '10' , '1','0',3*i),  list_stove[i] , list_micro[i] , list_garb[i] ,list_kitchen[i], list_refg[i]];
            data.addRow(dataRow);
          }
 
 
            var chart = new google.visualization.ChartWrapper({
              chartType   : 'ColumnChart',
              containerId : 'lineChartArea', //라인 차트 생성할 영역
              options     : {
                              isStacked   : true,
                              focusTarget : 'category',
                              height          : 500,
                              width              : '100%',
                              legend          : { position: "top", textStyle: {fontSize: 13}},
                              pointSize        : 5,
                              tooltip          : {textStyle : {fontSize:12}, showColorCode : true,trigger: 'both'},
                              hAxis              : {format: chartDateformat, gridlines:{count:chartLineCount,units: {
                                                                  years : {format: ['yyyy년']},
                                                                  months: {format: ['MM월']},
                                                                  days  : {format: ['dd일']},
                                                                  hours : {format: ['HH시']},
                                                                  minutes : {format:['mm분']},
                                                                  seconds : {format:['ss초']}
                                                                }
                                                                },textStyle: {fontSize:12}},
                vAxis              : {minValue: 3,viewWindow:{min:0},gridlines:{count:-1},textStyle:{fontSize:12}},
                animation        : {startup: true,duration: 1000,easing: 'in' },
                annotations    : {pattern: chartDateformat,
                                textStyle: {
                                fontSize: 15,
                                bold: true,
                                italic: true,
                                color: '#871b47',
                                auraColor: '#d799ae',
                                opacity: 0.8,
                                pattern: chartDateformat
                              }
                            }
              }
            });
 
            var control = new google.visualization.ControlWrapper({
              controlType: 'ChartRangeFilter',
              containerId: 'controlsArea',  //control bar를 생성할 영역
              options: {
                  ui:{
                        chartType: 'LineChart',
                        chartOptions: {
                        chartArea: {'width': '60%','height' : 80},
                          hAxis: {'baselineColor': 'none', format: chartDateformat, textStyle: {fontSize:12},
                            gridlines:{count:controlLineCount,units: {
                                  years : {format: ['yyyy년']},
                                  months: {format: ['MM월']},
                                  days  : {format: ['dd일']},
                                  hours : {format: ['HH시']},
                                  minutes : {format:['mm분']},
                                  seconds : {format:['ss초']}
                                }
                            }}
                        }
                  },
                    filterColumnIndex: 0
                }
            });
 
            var date_formatter = new google.visualization.DateFormat({ pattern: chartDateformat});
            date_formatter.format(data, 0);
 
            var dashboard = new google.visualization.Dashboard(document.getElementById('Line_Controls_Chart'));
            window.addEventListener('resize', function() { dashboard.draw(data); }, false); //화면 크기에 따라 그래프 크기 변경
            dashboard.bind([control], [chart]);
            dashboard.draw(data);
 
        }
          google.charts.setOnLoadCallback(drawDashboard);
 
      }
    }
 
$(document).ready(function(){
  google.charts.load('current', {'packages':['line','controls']});
  chartDrowFun.chartDrow(); //chartDrow() 실행
});
  </script>
</html>

  
  `
  return description;
},
graph_multi2:function graph_multi2(description_kitchen,description_lite,description_oven,description_refg,description_bath,description_state){

  var description = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Line_Controls_Chart</title>
 
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <!-- google charts -->
       <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  </head>
  <body>
 
    <h4>power consuming</h4>
 
    <div id="Line_Controls_Chart">
      <!-- 라인 차트 생성할 영역 -->
          <div id="lineChartArea" style="padding:0px 20px 0px 0px;"></div>
      <!-- 컨트롤바를 생성할 영역 -->
          <div id="controlsArea" style="padding:0px 20px 0px 0px;"></div>
        </div>
 
  </body>
 
  <script>
 
  var chartDrowFun = {
    
 
    chartDrow : function(){
        var chartData = '';
        var list_kitchen= [${description_kitchen}];
        var list_oven= [${description_oven}];
        var list_light= [${description_lite}];
        var list_refg= [${description_refg}];
        var list_bath=[${description_bath}];
        var list_state=[${description_state}];
        

        //날짜형식 변경하고 싶으시면 이 부분 수정하세요.
        var chartDateformat     = 'yyyy년MM월dd일hh시간mm분ss초';
        //라인차트의 라인 수
        var chartLineCount    = 10;
        //컨트롤러 바 차트의 라인 수
        var controlLineCount    = 10;
        
 
 
        function drawDashboard() {
 
          var data = new google.visualization.DataTable();
          //그래프에 표시할 컬럼 추가
          data.addColumn('datetime' , 'time');
          data.addColumn('number'   , 'kithen');
          data.addColumn('number'   , 'oven');
          data.addColumn('number'   , 'light');
          data.addColumn('number'   , 'refg');
          data.addColumn('number'   , 'bath');
          
           
          //그래프에 표시할 데이터
          var dataRow = [];
 
          for(var i = 0; i <= list_kitchen.length; i++){ //랜덤 데이터 생성
            dataRow = [new Date('2017', '09', '10' , '1','0',3*i),  list_kitchen[i] , list_oven[i] , list_light[i] , list_refg[i], list_bath[i]];
            data.addRow(dataRow);
          }
 
 
            var chart = new google.visualization.ChartWrapper({
              chartType   : 'ColumnChart',
              containerId : 'lineChartArea', //라인 차트 생성할 영역
              options     : {
                              isStacked   : true,
                              focusTarget : 'category',
                              height          : 500,
                              width              : '100%',
                              legend          : { position: "top", textStyle: {fontSize: 13}},
                              pointSize        : 5,
                              tooltip          : {textStyle : {fontSize:12}, showColorCode : true,trigger: 'both'},
                              hAxis              : {format: chartDateformat, gridlines:{count:chartLineCount,units: {
                                                                  years : {format: ['yyyy년']},
                                                                  months: {format: ['MM월']},
                                                                  days  : {format: ['dd일']},
                                                                  hours : {format: ['HH시']},
                                                                  minutes : {format:['mm분']},
                                                                  seconds : {format:['ss초']}
                                                                }
                                                                },textStyle: {fontSize:12}},
                vAxis              : {minValue: 3,viewWindow:{min:0},gridlines:{count:-1},textStyle:{fontSize:12}},
                animation        : {startup: true,duration: 1000,easing: 'in' },
                annotations    : {pattern: chartDateformat,
                                textStyle: {
                                fontSize: 15,
                                bold: true,
                                italic: true,
                                color: '#871b47',
                                auraColor: '#d799ae',
                                opacity: 0.8,
                                pattern: chartDateformat
                              }
                            }
              }
            });
 
            var control = new google.visualization.ControlWrapper({
              controlType: 'ChartRangeFilter',
              containerId: 'controlsArea',  //control bar를 생성할 영역
              options: {
                  ui:{
                        chartType: 'LineChart',
                        chartOptions: {
                        chartArea: {'width': '60%','height' : 80},
                          hAxis: {'baselineColor': 'none', format: chartDateformat, textStyle: {fontSize:12},
                            gridlines:{count:controlLineCount,units: {
                                  years : {format: ['yyyy년']},
                                  months: {format: ['MM월']},
                                  days  : {format: ['dd일']},
                                  hours : {format: ['HH시']},
                                  minutes : {format:['mm분']},
                                  seconds : {format:['ss초']}
                                }
                            }}
                        }
                  },
                    filterColumnIndex: 0
                }
            });
 
            var date_formatter = new google.visualization.DateFormat({ pattern: chartDateformat});
            date_formatter.format(data, 0);
 
            var dashboard = new google.visualization.Dashboard(document.getElementById('Line_Controls_Chart'));
            window.addEventListener('resize', function() { dashboard.draw(data); }, false); //화면 크기에 따라 그래프 크기 변경
            dashboard.bind([control], [chart]);
            dashboard.draw(data);
 
        }
          google.charts.setOnLoadCallback(drawDashboard);
 
      }
    }
 
$(document).ready(function(){
  google.charts.load('current', {'packages':['line','controls']});
  chartDrowFun.chartDrow(); //chartDrow() 실행
});
  </script>
</html>

  
  `
  return description;
}
//-----------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title= queryData.id;
    
    if(request.url == '/favicon.ico'){
        return response.writeHead(404);
      }
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){
      if(title===undefined){
        title='Welcome';
        var description = "hello,.js";
        fs.readdir(`data`,function(error,filelist){
          response.writeHead(200);
          response.end(template.HTML(title,template.List(filelist),description,``));       
          }) 
      }
      
    
      else if(title==="main")
      {
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_single(title,description_main),''));
    
       
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      }
      else if(title==="oven")
      {
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_single(title,description_oven),''));
    
       
});

      }else if(title==="refg")
      {
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_single(title,description_refg),''));
    
       
});

      }else if(title==="kitchen")
      {
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_single(title,description_kitchen),''));
    
       
});

      }else if(title==="light")
      {
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_single(title,description_lite),''));
    
       
});
      }
      else if(title==="all")
      {
      var description_stove=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_garb=[];
      var description_micro=[];
      var graph_list = [];
      fs.createReadStream("syntax/Total_state_bi.csv")
      .pipe(csv())
      .on('data', function(data){
      description_stove.push(data.stov);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_garb.push(data.garb);
      description_micro.push(data.micro);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_multi(description_stove, description_micro, description_garb, description_kitchen,description_refg),''));
    
       
});

        
    }
    else if(title==="state")
    {
    var description_state=[];
    var description_bath=[];
    var description_oven=[];
    var description_refg=[];
    var description_kitchen=[];
    var description_lite=[];
    var graph_list = [];
    fs.createReadStream("syntax/Total_state_mul.csv")
    .pipe(csv())
    .on('data', function(data){
    
    description_oven.push(data.oven);
    description_refg.push(data.refg);
    description_kitchen.push(data.kitchen);
    description_lite.push(data.lite);
    description_bath.push(data.bath);
    description_state.push(data.state);
        })
    .on('end',function(){
  
     
  console.log(graph_list);
  response.writeHead(200);
  response.end(template.HTML(title,'',template.graph_single(title,description_state),''));
  
     
});

      
  }
  else if(title==="state1")
    {
    var description_state=[];
    var description_bath=[];
    var description_oven=[];
    var description_refg=[];
    var description_kitchen=[];
    var description_lite=[];
    var graph_list = [];
    fs.createReadStream("syntax/Total_state_bi.csv")
    .pipe(csv())
    .on('data', function(data){
    
    
    description_state.push(data.state);
        })
    .on('end',function(){
  
     
  console.log(graph_list);
  response.writeHead(200);
  response.end(template.HTML(title,'',template.graph_single(title,description_state),''));
  
     
});

      
  }
    else if(title==="all2")
      {
      var description_state=[];
      var description_bath=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/Total_state_mul.csv")
      .pipe(csv())
      .on('data', function(data){
      
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
      description_bath.push(data.bath);
      description_state.push(data.state);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML(title,'',template.graph_multi2(description_kitchen, description_lite, description_oven, description_refg,description_bath,description_state),''));
    
       
});

        
    }
    
    
//---------------------------------------------------------------------------------------------------------------------------------
    
  }
    else if(pathname==='/home'){
      var description_time=[];
      var description_main=[];
      var description_oven=[];
      var description_refg=[];
      var description_kitchen=[];
      var description_lite=[];
      var graph_list = [];
      fs.createReadStream("syntax/data.csv")
      .pipe(csv())
      .on('data', function(data){
      description_time.push(data.time);
      description_main.push(data.main);
      description_oven.push(data.oven);
      description_refg.push(data.refg);
      description_kitchen.push(data.kitchen);
      description_lite.push(data.lite);
          })
      .on('end',function(){
    
       
    console.log(graph_list);
    response.writeHead(200);
    response.end(template.HTML('','','','')
    
 
    
  );
    
       
});

    }

    
     else {
        response.writeHead(404);;
        response.end("NOT FOdfUND !");

    }

    
});
app.listen(3000); 


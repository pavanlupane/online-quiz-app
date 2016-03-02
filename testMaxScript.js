var questionnireJSON;
var totalQs = 0;
var questionCnt=15;
var currentQuestion;
var answersKey = [];
var answersSelected = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var timeinterval;

$(document).ready(function(){
    /*Jquery code for CouchDB connection and data fetch*/ 
    $.get("http://localhost:5984/testmaxdb/_design/qnbank_json/_view/questionbank", function (data) {
       //console.log("jQuery Response::" + data);      // Database data received in questionnireJSON
        questionnireJSON = jQuery.parseJSON( data );
        totalQs = questionnireJSON.rows[0].value.totalqs;
        
         if (typeof totalQs != 'undefined'){
            console.log("Connected to DB successfully!");
            console.log("Total number of questions in DB ::" + totalQs);
             
            for(i=0;i<questionCnt;i++){
                answersKey[i] = questionnireJSON.rows[0].value.qsbank[i].answer;
            }
             //console.log(answersKey);
        }    
    });
    
    /*Load review table content Init*/
    var loadTableCnt = 0;
    while(loadTableCnt<questionCnt){
        $('#reviewTable').append('<tr><td><a class="qLinks" id=\'qs#'+(loadTableCnt+1)+'\'>Question '+(loadTableCnt+1)+'</a></td><td id=\'status'+(loadTableCnt+1)+'\'>Not Visited</td></tr>');
        loadTableCnt++;
    }
    
    /*question onClick transition code*/
    $(".qLinks").click(function(event){ //question links
        
        //console.log(event.target.id);
        var qsID = event.target.id;
        var qsIndex = qsID.split("#").pop();    //ready to use question index
        var questionString = null;
        var ansOptionsString = null;
        var saveAnsBtnString = null;
        //console.log(qsIndex);
        currentQuestion = qsIndex;
        
        if(answersSelected[qsIndex-1] == 0 || typeof answersSelected[qsIndex-1] == 'undefined'){
            $("#status" + qsIndex).html('<span>Visited<span>').css("color","#800000"); //updated status with visited
        }
        
        if(answersSelected[qsIndex-1] == 0){
            $('#prevAns').html('<span style="font-weight:bold; color:white;">Previous selected answer :: Not Answered</span>');
        }else{
            $('#prevAns').html('<span style="font-weight:bold; color:white;">Previous selected answer :: '+answersSelected[qsIndex-1]+'</span>');
        }
        
        
        $("#qOffset").html("<span>Q</span><span style=\"font-size: 25px; padding-left:5px;\">"+qsIndex+"</span>");   //loaded question header
        
        questionString = questionnireJSON.rows[0].value.qsbank[qsIndex-1].question;
        //console.log(questionString);
        $("#qData").html('<span>'+questionString+'</span>');    //loaded question string
        
        //console.log(questionnireJSON.rows[0].value.qsbank[qsIndex-1].ansOptions[0]);
        ansOptionsString = "<input id=\"radio1\" type=\"radio\" name=\"ans\" value=\"1\">&nbsp&nbsp&nbsp"+questionnireJSON.rows[0].value.qsbank[qsIndex-1].ansOptions[0]+"<br>";
        ansOptionsString += "<input id=\"radio2\" type=\"radio\" name=\"ans\" value=\"2\">&nbsp&nbsp&nbsp"+questionnireJSON.rows[0].value.qsbank[qsIndex-1].ansOptions[1]+"<br>";
        ansOptionsString += "<input id=\"radio3\" type=\"radio\" name=\"ans\" value=\"3\">&nbsp&nbsp&nbsp"+questionnireJSON.rows[0].value.qsbank[qsIndex-1].ansOptions[2]+"<br>";
        ansOptionsString += "<input id=\"radio4\" type=\"radio\" name=\"ans\" value=\"4\">&nbsp&nbsp&nbsp"+questionnireJSON.rows[0].value.qsbank[qsIndex-1].ansOptions[3]+"<br>";
        
        //console.log(ansOptionsString);
        $("#ansOpsForm").html(ansOptionsString);        //loaded answer options
        
        $("#saveAnsBtn").css("visibility","visible");       //set save answer button on
    });
    
    $("#saveAnsBtn").click(function(){
        //$("input:radio[name='ans']:checked").val();
        //console.log("Current question is :: "+currentQuestion);
        var selectedAns = $("input:radio[name='ans']:checked").val();
        //console.log("Selected ::"+selectedAns);
        if (typeof selectedAns != 'undefined'){
            answersSelected[currentQuestion-1]=selectedAns;     //saved selected answer in array
            $("#status" + currentQuestion).html('<span>Answered<span>').css("color","green"); //updated status with visited

            //console.log(answersSelected); 
            $('#prevAns').html('<span style="font-weight:bold; color:white;">Previous selected answer :: '+selectedAns+'</span>');
        }
       
    });
    
    function showResults(){     //calculate and show results in modal
        clearInterval(timeinterval);        //clear ticker interval
        $("#myModal").modal('show');
        
        var attempted = 0;
        var correctAns = 0;
        var resultString = null;
        
        for(key in answersSelected){
            if(answersSelected[key] != 0){
                attempted++;
            }
        }
        //console.log("Total attempted ::"+attempted);
        
        for(var i =0; i<questionCnt; i++){
            if(answersSelected[i] == answersKey[i]){
                correctAns++;
            }
        }
        //console.log("Correct Ans::"+correctAns);
        
        resultString = "<span>Total Number of Questions : "+questionCnt+"</span><br>";
        resultString +="<span>Total Questions attempted : "+attempted+"</span><br>";
        resultString +="<span>Total Correct Answers : "+correctAns+"</span><br><br>";
        resultString +="<span>Percentage Score : "+(Math.round((correctAns/questionCnt)*100))+" %</span><br>";
        
        $("#modalBodyResult").html(resultString);
    }
    
    var d = new Date();
    if(d.getHours() == 23){
        var currentEndDate = (d.getMonth()+1)+"/"+(d.getDate()+1)+'/'+d.getFullYear()+" "+'0'+':'+d.getMinutes()+':'+d.getSeconds();
    }  
    else
        var currentEndDate = (d.getMonth()+1)+"/"+d.getDate()+'/'+d.getFullYear()+" "+(d.getHours()+1)+':'+d.getMinutes()+':'+d.getSeconds();
    //console.log(currentEndDate);
    var endtime =currentEndDate;
    
    initializeClock(endtime); //initialize clock
    
    function getTimeRemaining(endtime){
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor( (t/1000) % 60 );
      var minutes = Math.floor( (t/1000/60) % 60 );
      var hours = Math.floor( (t/(1000*60*60)) % 24 );
      var days = Math.floor( t/(1000*60*60*24) );
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }
    
  function initializeClock(endtime){
        timeinterval = setInterval(function(){
        var t = getTimeRemaining(endtime);
        $("#ticker").html(t.hours + ' : ' + t.minutes + ' : ' + t.seconds);
        if(t.total<=0){     //if time finishes
            clearInterval(timeinterval);    //clear interval
            alert("Time finished.<br>Redirecting to results section.");
            setTimeout(showResults(), 5000); //redirect after 5 seconds
        }
      },1000);
}
    $("#clockBtn").click(function(){    //toggle clock code
        $("#ticker").toggle();
    });
    
    $("#submitTestBtn").click(function(){       //submit test code
        var endTestFlag = confirm("Do you want to exit test?");
        if (endTestFlag == true) {
            console.log("End Test.");
            showResults();
        } else {
            console.log("Continue test");
        }
    });
    
    $('.backToHomeBtn').click(function(){
         window.open('home.html','_self');
    });
});
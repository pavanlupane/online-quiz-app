var questionnireJSON;
var totalQs = 0;
var questionCnt=15;
var currentQuestion;
var answersKey = [];
var answersSelected = [];

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
//            console.log("Answers::");
//            for (key in answersKey){
//                console.log(answersKey[key]);
//            }
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
        console.log(qsIndex);
        currentQuestion = qsIndex;
        
        if(answersSelected[qsIndex-1] == 0 || typeof answersSelected[qsIndex-1] == 'undefined'){
            $("#status" + qsIndex).html('<span>Visited<span>').css("color","#800000"); //updated status with visited
        }
        
        if(typeof answersSelected[qsIndex-1] == 'undefined'){
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
        console.log("Current question is :: "+currentQuestion);
        var selectedAns = $("input:radio[name='ans']:checked").val();
        console.log("Selected ::"+selectedAns);
        if (typeof selectedAns != 'undefined'){
            answersSelected[currentQuestion-1]=selectedAns;     //saved selected answer in array
            $("#status" + currentQuestion).html('<span>Answered<span>').css("color","green"); //updated status with visited

            console.log(answersSelected); 
            $('#prevAns').html('<span style="font-weight:bold; color:white;">Previous selected answer :: '+selectedAns+'</span>');
        }
       
    });
});
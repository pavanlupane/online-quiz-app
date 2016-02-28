var questionnireJSON;
var totalQs = 0;
var questionCnt=15;

$(document).ready(function(){
    /*Jquery code for CouchDB connection and data fetch*/ 
    $.get("http://localhost:5984/testmaxdb/_design/qnbank_json/_view/questionbank", function (data) {
       //console.log("jQuery Response::" + data);      // Database data received in questionnireJSON
        questionnireJSON = jQuery.parseJSON( data );
        totalQs = questionnireJSON.rows[0].value.totalqs;
        
         if (typeof totalQs != 'undefined'){
            console.log("Connected to DB successfully!");
            console.log("Total number of questions in DB ::" + totalQs);    
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
        
        console.log(event.target.id);
        var qsID = event.target.id;
        var qsIndex = qsID.split("#").pop();    //ready to use question index
        console.log(qsIndex);

        $("#status" + qsIndex).html('<span>Visited<span>').css("color","green"); //updated status with visited
        
    });
    

});
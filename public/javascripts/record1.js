var tot_grass;
$(document).ready(function() {
  var count_grass = 0
  var recent_on_index_grass = 0;
  $('#record1').empty();
  var output_grass = ''
  output_grass += '<table border="1" width="250px" style="border-collapse:collapse;"><tr><th width="80%">시간</th><th width="20%">상태</th></tr>'
  $.getJSON('/record1', function(data){
    var time_grass = new Array();
    var status_grass = new Array();
    $(data).each(function(index, item){
      time_grass.push(item.time);
      status_grass.push(item.status);
      count_grass++
    });
    console.log(time_grass);
    console.log(status_grass);
    for(var i=0; i<count_grass; i++){
      if(status_grass[i]=="on"){
        break;
      }else{
        recent_on_index_grass++
      }
    }
    if(recent_on_index_grass == 0){
      clearTimeout(tot_grass);
      var ot_grass = time_grass[recent_on_index_grass].split('.');
      var ott_grass = ot_grass[3].split(':');
      (function updateTime_grass(){
        var dating_grass = new Date();
        var month_grass = dating_grass.getMonth()+1;
        var date_grass = dating_grass.getDate();
        var hour_grass = dating_grass.getHours();
        var minute_grass = dating_grass.getMinutes();
        var second_grass = dating_grass.getSeconds();
        if(month_grass==1){
          month_grass = 13;
          month_grass = month_grass - ot_grass[1];
          month_grass = month_grass*31
        }else{
          if(month_grass==2) {
            month_grass = month_grass - ot_grass[1];
            month_grass = month_grass*31
          } else if(month_grass==3) {
            month_grass = month_grass - ot_grass[1];
            month_grass = month_grass*28
          } else if(month_grass==4) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*31
          } else if(month_grass==5) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*30;
          } else if(month_grass==6) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*31
          } else if(month_grass==7) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*30
          } else if(month_grass==8) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*31
          }else if(month_grass==9) {
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*31
          }else if(month_grass==10){
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*30
          }else if(month_grass==11){
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*31
          }else if(month_grass==12){
            month_grass = month_grass - ot_grass[1]
            month_grass = month_grass*30
          }
        }
        date_grass = date_grass - ot_grass[2];
        date_grass = month_grass + date_grass;
        hour_grass = hour_grass - ott_grass[0];
        hour_grass = (date_grass * 24)+hour_grass;
        minute_grass = minute_grass - ott_grass[1];
        minute_grass = (hour_grass*60)+minute_grass;
        second_grass = second_grass - ott_grass[2];
        if(second_grass < 0){
          second_grass = 60 + second_grass
          minute_grass = minute_grass - 1
        }
        $('#on_off_time_at1').empty();
        $('#on_off_time_at1').append('가동시간: <b>'+minute_grass+'분 '+second_grass+'초</b>');
        tot_grass = setTimeout(updateTime_grass, 1000);	
      })();
    } else {
      clearTimeout(tot_grass)
      var oft_grass = time_grass[recent_on_index_grass-1].split('.')
      var oftt_grass = oft_grass[3].split(':')
      var ont_grass = time_grass[recent_on_index_grass].split('.')
      var ontt_grass = ont_grass[3].split(':')
      var fomonth_grass;
      var fodate_grass;
      var fominute_grass;
      var fosecond_grass;
      if(oft_grass[1] == 1){
        fomonth_grass = 13
        fomonth_grass = fomonth_grass - ont_grass[1];
        fomonth_grass = fomonth_grass*31
      } else {
        fomonth_grass = oft_grass[1] - ont_grass[1]
        if(oft_grass[1]==2){
          fomonth_grass = fomonth_grass * 31
        }else if(oft_grass[1]==3){
          fomonth_grass = fomonth_grass * 28
        }else if(oft_grass[1]==4){
          fomonth_grass = fomonth_grass * 31
        }else if(oft_grass[1]==5){
          fomonth_grass = fomonth_grass * 30
        }else if(oft_grass[1]==6){
          fomonth_grass = fomonth_grass * 31
        } else if(oft_grass[1]==7){
          fomonth_grass = fomonth_grass * 30
        } else if(oft_grass[1]==8){
          fomonth_grass = fomonth_grass * 31
        } else if(oft_grass[1]==9){
          fomonth_grass = fomonth_grass * 31
        } else if(oft_grass[1]==10){
          fomonth_grass = fomonth_grass * 30
        } else if(oft_grass[1]==11){
          fomonth_grass = fomonth_grass*31
        } else if(oft_grass[1]==12){
          fomonth_grass = fomonth_grass*30
        }
      }
			fodate_grass = oft_grass[2] - ont_grass[2];
			fodate_grass = fomonth_grass + fodate_grass;
			fohour_grass = oftt_grass[0] - ontt_grass[0];
			fohour_grass = (fodate_grass*24)+fohour_grass;
			fominute_grass = oftt_grass[1] - ontt_grass[1];
			fominute_grass = (fohour_grass*60)+fominute_grass;
			fosecond_grass = oftt_grass[2] - ontt_grass[2];
			if(fosecond_grass <0){
				fosecond_grass = 60+fosecond_grass
				fominute_grass = fominute_grass - 1;
			}
			$('#on_off_time_at1').empty();
			$('#on_off_time_at1').append('가동시간: <b>'+fominute_grass+'분 '+fosecond_grass+'초</b>');
		}
		var rot_grass = time_grass[recent_on_index_grass].split('.');
		var rott_grass = rot_grass[3].split(':');
		$('#sol_on_time1').empty();
		$('#sol_on_time1').append("최근 개방 시각<br>- "+rot_grass[0]+"/"+rot_grass[1]+"/"+rot_grass[2]+" "+rott_grass[0]+"시 "+rott_grass[1]+"분 "+rott_grass[2]+"초");
		if(status_grass[0]=="on"){
			$('#sol_status1').empty();
			$('#sol_status1').append('현재 상태(잔디용): 개방');
		}else if(status_grass[0]=="off"){
			$('#sol_status1').empty();
			$('#sol_status1').append('현재 상태(잔디용): 폐쇄');
		}
		if(count_grass < 8){
			for(var i=0; i<count_grass; i++){
				output_grass += '<tr><td>'+time_grass[i]+'</td><td>'+status_grass[i]+'</td></tr>'
			}
			for(var i=count_grass; i<8; i++){
				output_grass += '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>'
			}
		}else{
			for(var i=0; i<8; i++){
				output_grass += '<tr><td>'+time_grass[i]+'</td><td>'+status_grass[i]+'</td></tr>'
			}
		}
		var eight_grass = Math.floor(count_grass/8)
		var eight3_grass = count_grass/8;
		if((eight3_grass-eight_grass)!=0){
			eight_grass+=1
		}
		if(eight_grass<=10){
			output_grass += '<tr><td colspan="2">'
			for(var i=0; i<eight_grass; i++){
				output_grass += '<a style="cursor:pointer;" class="pageNum_grass" id="pageNumbering'+(i+1)+'">'+(i+1)+'</a>&nbsp;&nbsp;'
			}
			output_grass += '</td></tr></table>'
		}else{
			output_grass += '<tr><td colspan="2">'
			for(var i=0; i<10; i++){
				output_grass += '<a style="cursor:pointer;" class="pageNum_grass" id="pageNumbering'+(i+1)+'">'+(i+1)+'</a>&nbsp;&nbsp;'
			}
			output_grass += '</td></tr></table>'
		}
		$('#record1').append(output_grass)
	});
	$('body').on('click', '.pageNum_grass', function(){
		var count1_grass = 0;
		var pn_grass = 0;
		var page_num_grass = this.getAttribute('id');
		var output1_grass = ''
		output1_grass +='<table border="1" width="250px" style="border-collapse:collapse"><tr><th width="80%">시간</th><th width="20%">상태</th></tr>'
		$.getJSON('/record1', function(data){
			var time1_grass = new Array();
			var status1_grass = new Array();
			$(data).each(function(index, item){
				time1_grass.push(item.time);
				status1_grass.push(item.status);
				count1_grass++;
			});
			var eight1_grass = Math.floor(count1_grass/8);
			var eight2_grass = count1_grass/8;
			if((eight2_grass-eight1_grass)!=0){
				eight1_grass+=1
			}
			for(var i=1; i<eight1_grass+1; i++){
				if('pageNumbering'+i==page_num_grass){
					pn_grass=i
				}
			}
			if((pn_grass*8)==count_grass){
				for(var i = ((pn_grass-1)*8); i<(pn_grass*8); i++){
					output1_grass += '<tr><td>'+time1_grass[i]+'</td><td>'+status1_grass[i]+'</td></tr>'
				}
			}else if(((pn_grass-1)*8)<count_grass&&count_grass<(pn_grass*8)){
				for(var i=((pn_grass-1)*8); i<count_grass; i++){
					output1_grass += '<tr><td>'+time1_grass[i]+'</td><td>'+status1_grass[i]+'</td></tr>'
				}
				for(var i=count_grass; i<(pn_grass*8); i++){
					output1_grass += '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>'
				}
			}else{
				for(var i = ((pn_grass-1)*8); i<(pn_grass*8); i++){
					output1_grass += '<tr><td>'+time1_grass[i]+'</td><td>'+status1_grass[i]+'</td></tr>'
				}
			}
			if(eight1_grass<=10){
				output1_grass += '<tr><td colspan="2">'
				for(var i=0; i<eight1_grass; i++){
					output1_grass += '<a style="cursor:pointer;" class="pageNum_grass" id="pageNumbering'+(i+1)+'">'+(i+1)+'</a>&nbsp;&nbsp;'
				}
      }else{
        output1_grass +='<tr><td colspan="2">'
        for(var i=0; i<10; i++){
          output1_grass += '<a style="cursor:pointer;" class="pageNum_grass" id="pageNumbering'+(i+1)+'">'+(i+1)+'</a>&nbsp;&nbsp;'
        }
      }
      output1_grass += '</td></tr></table>'
      $('#record1').empty();
      $('#record1').append(output1_grass);
    })
  })
})

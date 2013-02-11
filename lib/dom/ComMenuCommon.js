// managed by hsyoon 2003-05-28
// 전역변수여야함
var off_img ,off_menu, off_cnt, off_objid

//pirpor:start
//투표와설문조사 New마크 표시여부(두개다 있을때 하나에만 New마크 달아줌) ---- 3월 18일 이후 내릴때 삭제함.. 
var blGCOM09Exist; 
blGCOM09Exist = false;
//pirpor:end

function SetCookie(name, value)
{
    document.cookie = name + "=" +escape(value) + ";path=/";
    document.location.href = document.location.href;
}

//그룹핑 on/off 스크립트
//grpcnt:전체그룹수,val:그룹ID,cnt:그룹에포함된메뉴수
function GroupShow(groupid)
{
	var iconimg = "folder";
	if (off_objid == "GCOM52") {iconimg = "rfolder";}

	//현재 값
	var ImgSrc = "Img" + "Group" + g_groupinfo[groupid][0];
	var Menunm = "Menu" + "Group" + g_groupinfo[groupid][0];

	var total = 0;
	var off_total = 0;

	var imgup = g_imgsvr + "/ComMenu/group/" + iconimg + "_close.gif";
	var imgdown = g_imgsvr + "/ComMenu/group/" + iconimg + "_open.gif";
	var strimg = document.images[ImgSrc].src;

	//Menu Open
	if (strimg.substring(strimg.indexOf("close")) == imgup.substring(imgup.indexOf("close"))){
		if ((off_img != null) && (off_menu != null) || (off_cnt != null)) {
			document.images[off_img].src = imgup;
			for(var i=0; i<off_cnt; i++){
				off_total = off_total + 1;
				document.getElementById(off_menu + "," + off_total).style.display = "none";
				}
		}
		document.images[ImgSrc].src = strimg.substring(0, strimg.indexOf("close")) + "open.gif"; //imgdown;
		for(var i=0; i<g_groupinfo[groupid][1]; i++){
			total = total + 1;
			document.getElementById(Menunm + "," + total).style.display = "";
			}
	}
	//Menu Close
	else if  (strimg.substring(strimg.indexOf("open")) == imgdown.substring(imgdown.indexOf("open"))) {
		if ((off_img != null) && (off_menu != null) || (off_cnt != null)) {
			if (off_menu != Menunm) {
				document.images[off_img].src = imgup;
				for(var i=0; i<off_cnt; i++){
					off_total = off_total + 1;
					document.getElementById(off_total + "," + total).style.display = "none"; }
			}
		}
		document.images[ImgSrc].src = strimg.substring(0, strimg.indexOf("open")) + "close.gif"; //imgup;
		for(var i=0; i<g_groupinfo[groupid][1]; i++){
			total = total + 1;
			//document.getElementById(Menunm + "," + total).style.display = "none";}
			document.getElementById(Menunm + "," + total).style.display = "none";}
		}
	// 현재값을 기억시킴
	off_img	= ImgSrc;
	off_menu = Menunm;
	off_cnt = g_groupinfo[groupid][1];
	off_objid = g_groupinfo[groupid][3];
}

function GetMenuName(spanwidth, objid, objseq, funcnm, isnew, menuicon, linkclassnm, objurl, objimg, objcss) {
	var objidx;
	var menulink;
	var tailimg;
	var xtarget;
	var returnval;
	var menuclass;
    var aryTemp, idx, customerStyle, frontStyle, backStyle;
    customerStyle = "";
    frontStyle = "";
    backStyle = "";
	idx = 0;
	tailimg = "";
	returnval = "";

	if (objid.substr(0,4) == "GCOM") {
		objidx = parseInt(objid.substr(4,2),10)
		switch (objidx) {
			case 1: menulink = g_commsvr + "/ComService/Activity/Notice/CsNoticeList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="notice"; break; // 공지사항
			case 2: menulink = g_bbssvr + "/ComService/Activity/BBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="bbs"; break; // 게시판
			case 3: menulink = g_commsvr + "/ComService/Activity/PDS/CsPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="pds"; break; // 자료실
			case 4: menulink = g_commsvr + "/ComService/Activity/GuestBook/CsGuestBookList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="visit"; break; // 방명록
			case 5: menulink = g_commsvr + "/ComService/Activity/Discuss/CsDiscussList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="debate"; break; // 토론실
			case 6: menulink = g_commsvr + "/ComService/Activity/Calendar/CsCalViewMonth.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="calendar"; break; // 일정관리
			case 7: menulink = g_commsvr + "/ComService/Activity/Vote/CsVoteList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="vote"; break; // 투표
			case 9: menulink = g_commsvr + "/ComService/Activity/Survey/CsSurveyList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="research"; break; // 설문
			case 11: menulink = g_playsvr + "/chat/PeCtRoomListComm.asp?grpid=" + g_curgrpid;menuclass="chat"; break; // 채팅
			case 13: menulink = g_commsvr + "/ComService/Activity/Album/CsPhotoList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq + "&grpurl=" + g_grpurl;menuclass="album"; break; // 앨범
			case 15: menulink = g_commsvr + "/ComService/Activity/CoolSite/CsCoolSites.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; menuclass="site";break; // 쿨사이트
			case 16: menulink = g_bbssvr + "/ComService/Activity/QnA/CsQnAList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="bbs"; break; // Q&A
			case 20: menulink = g_wwwsvr + "/ComService/Activity/SmallGroup/CsAliSmlList.asp?GrpId=" + g_curgrpid;menuclass="somoim";break; // 소그룹활동
			case 22: menulink = g_bbssvr + "/ComService/Activity/EstimBBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="rmcomm"; break; // 추천게시판
			case 23: menulink = g_bbssvr + "/ComService/Activity/ABBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="bbs3"; break; // 익명게시판
			case 30: menulink = g_commsvr + "/ComService/Activity/Pay/CsPayList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="pay"; break; // 회비관리
			case 36: menulink = g_commsvr + "/ComService/Activity/Wi/default.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="commsms"; break; // 무선서비스
			case 37: menulink = g_commsvr + "/ComService/Activity/Moim/MoimBBS/MoMain.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="moimbbs"; break; // 번개정모게시판
			//case 38: menulink = g_msgrsvr + "/p2p/PCommUserList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; break; // P2P 자료실
			case 45: menulink = g_commsvr + "/ComService/Activity/alliance/Csalliancelist.asp?GrpId=" + g_curgrpid + "&ObjSeq=1";menuclass="memberinfo"; break; //회원정보
			case 51: menulink = "JavaScript:openMemo(" + objseq + ")";menuclass="memo";  break; //메모장
			case 53: menulink = g_commsvr + "/ComService/Activity/MasterPR/MasterPRDisplay.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="bbs"; break; //마스터프로필
			case 55: menulink = g_commsvr + "/ComService/Activity/MPDS/CsMPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="pds2"; break; // 대용량자료실
			case 58: menulink = g_commsvr + "/ComService/Activity/VPDS/CsMPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="pds2"; break;		// 프리미엄자료실
			case 59: menulink = g_commsvr + "/ComService/Activity/VPDS/CsVPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="gigapds"; break;		// 기가자료실
			case 60: menulink = g_commsvr + "/ComService/Activity/VPDS/CsUPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="pds3"; break;		// 프리미엄익명
			case 61: menulink = g_commsvr + "/ComService/Activity/XBBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;menuclass="bbs4"; break;		// 동영상게시판
			default: menulink = ""; break;
		}

		if (menulink != "") {
			returnval += "<li";
			if (menuicon == true) {
			    returnval += " class='" + menuclass + "'";
			}
			returnval += ">";
			
			if ( (objidx >= 1 && objidx <= 5) || objidx == 13 || objidx == 16 || objidx == 22 || objidx == 23 || objidx == 26 || objidx == 31 || objidx == 32 || objidx == 33 || objidx == 45 || objidx == 51 || objidx == 53 || objidx == 58 || objidx == 59 || objidx == 60 || objidx == 61) {
				if (isnew == "1") tailimg = "&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif'>";
			} else {
				if (objidx == 7 || objidx == 9 || objidx == 11 || objidx == 37) {
					if (isnew == "1") tailimg = "&nbsp;<img src='" + g_imgsvr + "/Commenu/ing2.gif' border=0 width=11 height=11 align=texttop>";
				}
			}

            returnval += "<a href='" + menulink + "' class='" + linkclassnm + "'";
			if(objcss != "") {
                returnval += " style='"+ objcss +"'>";
//			    returnval += "<font style='" + objcss + "'>" + funcnm + "</font>";

                aryTemp = objcss.split("; ");

                for(idx = 0; idx<aryTemp.length; idx++) {
                    aryTemp[idx] = aryTemp[idx].replace(";", "");

                    frontStyle = aryTemp[idx].substring(0, aryTemp[idx].indexOf(":"));
                    backStyle  = aryTemp[idx].substring(aryTemp[idx].indexOf(":")+1);

                    customerStyle += "this.style.";
                    if(frontStyle.indexOf("-") >-1) {
                        customerStyle += frontStyle.substring(0,frontStyle.indexOf("-")) + frontStyle.substr(frontStyle.indexOf("-")+1,1).toUpperCase() + frontStyle.substring(frontStyle.indexOf("-")+2) + "='"+ backStyle +"'; ";
                    }
                    else customerStyle += frontStyle + "='"+ backStyle +"'; ";
                }
			}
		    else {
		        returnval += ">";
                customerStyle = "this.style.textDecoration='none';"
		    }

		    returnval += "<span onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\"" + customerStyle +"\">"+ funcnm +"</span></a>";

			if (objimg != "")  tailimg += "&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + objimg + "' border=0>";

			////투표나 설문조사일때 New 마크 달아줌.. pirpor:start
			var now, mm, dd, hh;
			now = new Date();
			mm = now.getMonth()+1;
			dd = now.getDate();
			hh = now.getHours();

			if ((mm==5 && dd==20) || (mm==5 && dd ==21 && hh < 16)) {
				if (blGCOM09Exist == true) {
					if (objidx == 9) tailimg += "<img src='" + g_imgsvr + "/community/common/ico_n.gif'>";
				}
				else if (objidx == 7) {
					tailimg += "<img src='" + g_imgsvr + "/community/common/ico_n.gif'>";
				}
			}
			////Pirpor:End

			returnval += tailimg + "</li>";
		} 
		else if ((menulink == "") && ((objidx == 46) || (objidx == 47) || (objidx == 48) || (objidx == 50))) {    //커뮤니티 추가메뉴
			if (objidx == 46) { // 링크메뉴
				menuclass = "linkmenu";
			}
			// EDIT || HTML
			if (objidx == 47 || objidx == 50) {
				menuclass = "commpage";
			}
            // 게시물
			if (objidx == 48) {
				menuclass = "commbbs"
			}
			returnval += "<li"
			if (menuicon == true) {
                returnval += " class='" + menuclass + "'"
			}
			returnval += ">"
			if ((objidx == 47) || (objidx == 50)) {
                returnval += "<a href='" + g_wwwsvr + '/' + g_grpurl + '/' + objurl + "' class='" + linkclassnm + "'";
			} 
			else if (objidx == 46) {
			    returnval += "<a href='" + objurl + "' target='_new' class='" + linkclassnm + "'";
			} 
			else if (objidx == 48) {
		        returnval += "<a href='" + objurl + "' class='" + linkclassnm + "'";
			}

//			if (objcss != "") returnval += "<font style='" + objcss + "''>" + funcnm + "</font></a>";
			if(objcss != "") {
                returnval += " style='"+ objcss +"'>";

                aryTemp = objcss.split("; ");

                for(idx = 0; idx<aryTemp.length; idx++) {
                    aryTemp[idx] = aryTemp[idx].replace(";", "");

                    frontStyle = aryTemp[idx].substring(0, aryTemp[idx].indexOf(":"));
                    backStyle  = aryTemp[idx].substring(aryTemp[idx].indexOf(":")+1);

                    customerStyle += "this.style.";
                    if(frontStyle.indexOf("-") >-1) {
                        customerStyle += frontStyle.substring(0,frontStyle.indexOf("-")) + frontStyle.substr(frontStyle.indexOf("-")+1,1).toUpperCase() + frontStyle.substring(frontStyle.indexOf("-")+2) + "='"+ backStyle +"'; ";
                    }
                    else customerStyle += frontStyle + "='"+ backStyle +"'; ";
                }
			}
		    else {
		        returnval += ">";
                customerStyle = "this.style.textDecoration='none';"
		    }
		    
		    returnval += "<span onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\"" + customerStyle +"\">"+ funcnm +"</span></a>";

			if (objimg != "") tailimg += "&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + objimg + "' border=0>"
			
			returnval += tailimg + "</li>";
			
		} else if ((menulink == "") && (objidx == 49)) {
			returnval += "<li class='categoryLine'><!--  -->" ;
			returnval += tailimg + "</li>";
		}

//		if (menulink != "") return Displayfreecommmenu(menulink, Spanwidth)
        return returnval;
	}
	if (objid.substr(0,4) == "XCOM") {
		objidx = parseInt(objid.substr(4,2),10)
		xtarget = " target='_blank'"
		switch (objidx) {
			case 6: menulink = "JavaScript:goNorazo()"; xtarget=""; break;//g_gamesvr + "/ptop/game/community/default.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq; xtarget=""; break; // 커뮤니티 게임
			case 9: menulink = g_wwwsvr + "/_market/BV/fc2bv.asp";menuclass="shopping"; break; // 쇼핑
			case 15: menulink = g_mallsvr + "/AvtMall/AMMain.asp";menuclass="avata"; break; // 아이템몰
			default: menulink = ""; break;
		}
		if (menulink != "") {
			returnval += "<li"
			if (menuicon == true) {
				if (objid == "XCOM06") tailimg = "game.gif"; else tailimg = "contents.gif"
				returnval += " class='" + menuclass + "'"
				tailimg = ""
			}
			returnval += "><a href='" + menulink + "'" + xtarget + ">" + funcnm + "</a></li>"
		}
//		if (menulink != "") return Displayfreecommmenu(menulink, Spanwidth)
        return returnval;
	}
	/* 방통대 메뉴 삭제
	if (objid == "KNOU01") {
		if (menuicon == true) {
			returnval += "<img src='" + g_imgsvr + "/Commenu/Info.gif' border=0 align='texttop' width=17 height=18>&nbsp;"
		}
		returnval += "<a href='" + g_wwwsvr + "/_knou/info/info.asp?GrpId=" + g_curgrpid + "' class='" + linkclassnm + "'>정보제공실</a>"

		return returnval;
//		return Displayfreecommmenu(menulink, Spanwidth)
	}*/
	if (objid.substr(0,4) == "GETC") {		//숨겨진 메뉴처리
		objidx = parseInt(objid.substr(4,2),10)
		switch (objidx) {
			case 1: menulink = g_wwwsvr + "/" + objurl + "/"; break;	//추천커뮤니티 리스트
			case 3: menulink = "javascript:openSum(\"\",\"" + objurl + "\")"; break;	//섬리스트
			default: menulink = ""; break;
		}

        returnval += "<tr><td style='padding:0 3px 3px 1px;'><img src='"+ g_imgsvr +"/community/common/white/Ico_d01.gif' hspace='1'>";
		if (menulink != "") {
			if (isnew == "1") tailimg = "&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif' border=0 align=texttop>"

			if (objid=="GETC03") {
			    returnval += "&nbsp;<a href='" + menulink + "' class='" + linkclassnm + "' target='_self'";
            }
			else {
			    returnval += "&nbsp;<a href='" + menulink + "' class='" + linkclassnm + "' target='_commwin'";
			}
            // 사용자 스타일 설정
			if(objcss != "") {
                returnval += " style='"+ objcss +"'>";

                aryTemp = objcss.split("; ");

                for(idx = 0; idx<aryTemp.length; idx++) {
                    aryTemp[idx] = aryTemp[idx].replace(";", "");

                    frontStyle = aryTemp[idx].substring(0, aryTemp[idx].indexOf(":"));
                    backStyle  = aryTemp[idx].substring(aryTemp[idx].indexOf(":")+1);

                    customerStyle += "this.style.";
                    if(frontStyle.indexOf("-") >-1) {
                        customerStyle += frontStyle.substring(0,frontStyle.indexOf("-")) + frontStyle.substr(frontStyle.indexOf("-")+1,1).toUpperCase() + frontStyle.substring(frontStyle.indexOf("-")+2) + "='"+ backStyle +"'; ";
                    }
                    else customerStyle += frontStyle + "='"+ backStyle +"'; ";
                }
			}
		    else {
		        returnval += ">";
                customerStyle = "this.style.textDecoration='none';"
		    }
		    
		    returnval += "<span onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\"" + customerStyle +"\">"+ funcnm +"</span></a>";
/*		    
			if (objcss != "") returnval += "<font style='" + objcss + "'>"  + funcnm + "</font></a>";
		    else returnval += funcnm +"</a>";
*/			
			returnval += tailimg + "</td></tr>";
//			if (menulink != "") return Displayfreecommmenu(menulink, Spanwidth)

            return returnval;
		}
	}
}

//메뉴의 가입, 숨기기 나타내기
function DisplayTopButton(classnm) {
	if (g_mngpermission)
		return;

	if (g_canapply == false) {
		document.write('<a href="' + g_wwwsvr + '/ComService/Activity/ApplyEntry/CsActAplJoinForm.asp?GrpId=' + g_curgrpid + '">');
		(g_leftmenu.indexOf('L03')>-1)? document.write('<img src="' + g_imgsvr + '/ComMenu/btn_03.gif" border="0" align="absmiddle" width="70" height="20" style="position:relative">') : document.write('<img src="' + g_imgsvr + '/ComMenu/btn_join3.gif" border="0" align="absmiddle" width="64" height="20">');
		document.write('</a>&nbsp;<a href="' + g_commsvr + '/MyComm/MyCommunities/MySetFreComAdd2.asp?GrpId=' + g_curgrpid + '&rtnURL=' + escape(document.location.href) + '" target="_new">');
		(g_leftmenu.indexOf('L03')>-1)? document.write('<img src="' + g_imgsvr + '/ComMenu/btn_04.gif" border="0" align="absmiddle" width="70" height="20" style="position:relative">') : document.write('<img src="' + g_imgsvr + '/ComMenu/btn_fre2.gif" border="0" align="absmiddle" width="64" height="20">');
		document.write('</a>')
	}
	else if (g_leftmenu.indexOf('L03')>-1) {
		document.write('<tr><td align=center><a href="' + g_homesvr + '/ComService/Activity/Invite/CsInvItemailForm.asp?GrpId=' + g_curgrpid + '">');
		document.write('<img src="'+ g_imgsvr +'/ComMenu/btn_01.gif" width=50 height=20 style="position:relative">');
		document.write('</a><img src="' + g_imgsvr + '/1by1.gif" width=2><a href="' + g_homesvr + '/ComService/Activity/sum/makesum.asp?grpid=' + g_curgrpid + '">');
		document.write('<img src="'+ g_imgsvr +'/ComMenu/btn_02.gif" width=90 height=20 style="position:relative">');
		document.write('</a>');
	}
}

//메뉴의 커뮤니티정보 나타내기
function DisplayCommInfo(classnm) {
	var cslink = 'mlink';
	var strImgUrl = g_imgsvr + '/ComMenu';
	var strAlign1 = 'center';
	var strAlign2 = 'center';
	var strMasternm = '';
	var intWidth = 47;
	var intHeight = 14;

	if (g_menuitem == "Y") {
			strImgUrl = g_comitemimgprefix;
			strAlign1 = 'right';
			strAlign2 = 'left';
			intWidth = 49;
			intHeight = 11;
	}
	if (classnm != "menu") {cslink = classnm;}
	if ((g_menuitem == "Y") && (g_userid == "Guest")) {
		strMasternm = g_masternm;
	} else {
		strMasternm = '<span onClick="openHompy(\'' + g_masterid + '\')" style="cursor:hand;">' + g_masternm + '</span>';
	}

	document.writeln('<tr>')
	if (g_leftmenu.indexOf('L03')>-1) {
		if (g_menustyle == "1") {
			document.writeln('<td  width="50" align="right">회원수 :</td>')
			document.writeln('<td class="'+ classnm +'" align="left">' + FormatNumber(g_membercnt) + ' 명</td>')
	
		} else if ((g_menustyle == "2") || (g_menustyle == "4")) {
			document.writeln('<td colspan=2></td>')
	
		} else if (g_menustyle == "3") {
			document.writeln('<td width="50" align="right">마스터 :</td>')
			document.writeln('<td class="'+ classnm +'" align="left">' + strMasternm + '</td>')
	
		} else {
			document.writeln('<td width="50" class="'+ classnm +'" align="right">마스터 :<br>회원수 :</td>')
			document.writeln('<td class="'+ classnm +'" align="left"><b>' + strMasternm + '</b><br>' + FormatNumber(g_membercnt) + ' 명</td>')
		}
	}
	else {
		if (g_menustyle == "1") {
			document.writeln('<td align="right" width="50%"><img src="' + strImgUrl + '/icon_member.gif" border=0 align="absmiddle"></td>')
			document.writeln('<td class="'+ classnm +'" align="left" width="50%" style="padding-top:3px;">&nbsp; ' + FormatNumber(g_membercnt) + ' 명</td>')
	
		} else if ((g_menustyle == "2") || (g_menustyle == "4")) {
			document.writeln('<td colspan=2></td>')
	
		} else if (g_menustyle == "3") {
			document.writeln('<td align="right"><img src="' + strImgUrl + '/icon_master.gif" border=0 align="absmiddle"></td>')
			document.writeln('<td class="'+ classnm +'" align="left" style="padding-top:3px;">&nbsp;' + strMasternm + '&nbsp;</td>')
	
		} else {
			document.writeln('<td align="' + strAlign1 + '"><img src="' + strImgUrl + '/icon_master.gif" border=0></td>')
			document.writeln('<td align="' + strAlign2 + '"><img src="' + strImgUrl + '/icon_member.gif" border=0></td>')
			document.writeln('</tr>')
			document.writeln('<tr>')
			document.write('<td align="right" class="'+ classnm +'" style="padding-left:5px;">' + strMasternm + '&nbsp;</td>')
			if ((g_menuitem == "N") && (g_commtype == "F")) {
				document.writeln('<td class="'+ classnm +'" align="left" style="padding-left:5px; padding-top:3px;">&nbsp;' + FormatNumber(g_membercnt) + ' 명</td>');
			} else {
				document.writeln('<td class="'+ classnm +'" align="left" style="padding-left:5px; padding-top:3px;"><a href="' + g_commsvr + '/ComService/Activity/online/CsOnLineList.asp?grpid=' + g_curgrpid + '" class="'+ cslink +'">' + FormatNumber(g_membercnt) + '</a> 명</td>');
			}
		}
	}
	document.writeln('</tr>')
}

//이미지 메뉴노출하기
function DisplayGETCInfo(classnm) {
	if (g_getc02info.length > 0) {

		var imgrate = '100%';
		var objimg	= g_getc02info[0][8];
		var objlink = "";
		var objhelp	= g_getc02info[0][6];

		if (g_menuitem == "N") {imgrate = parseInt(g_menuwidth * 0.9)-10;}
		else {imgrate = 123}

		document.writeln('<tr><td valign=bottom><table border=0 cellpadding=3 cellspacing=0 width="100%">');

		if (objimg != "") {
			document.writeln('<tr><td align=center><span style="overflow:hidden; width:' + imgrate + ';"><img src="' + g_homesvr + '/' + g_grpurl + '/images/' + objimg + '" align=absmiddle></span></td><tr>')
			if (objhelp != "") {
				document.write('<tr><td height=13 valign=bottom><img src="' + g_imgsvr + '/ComMenu/img/comment.gif" border=0 align=absmiddle)>&nbsp;<span id="btn_comment"><');
				document.write('a href="JavaScript:CommentHide();"><img src="' + g_imgsvr + '/ComMenu/img/up.gif" border=0 align=absmiddle id="btn_up"></a></span></td></tr>');
				document.writeln('<tr id="getchelp" style="display:bolck;"><td class="' + classnm + '" style="padding:4px;" valign=top>' + objhelp + '</td></tr>')
			}
		} else {
			document.writeln('<tr><td class="mtitle" align=center><img src="'+ g_imgsvr +'/ComMenu/img/img.gif" border=0 align=absmiddle></td></tr>')
		}

		document.write('<div style="position:relative;"><a href="' + g_homesvr + '/ComService/Management/Menu/Template/CsSetMenuStyle.asp?Grpid=' + g_curgrpid + '"><img src="' + g_imgsvr + '/ComMenu/img/edit.gif" border=0 align=absmiddle style="position:absolute;left:3px;top:3px"></a></div>');
		document.write('</table></td></tr>')
		
	}
}

//이미지 + Comment보기
function CommenuShow() {
	document.getElementById("getchelp").style.display = "";
	document.getElementById("btn_comment").innerHTML = "<a href='JavaScript:CommentHide();'><img src='" + g_imgsvr + "/ComMenu/img/up.gif' border=0 align=absmiddle id='btn_up'></a>";
}

//이미지만 보기
function CommentHide() {
	document.getElementById("getchelp").style.display = "none";
	document.getElementById("btn_comment").innerHTML = "<a href='JavaScript:CommenuShow();'><img src='" + g_imgsvr + "/ComMenu/img/down.gif' border=0 align=absmiddle id='btn_down'></a>";
}

function viewNhide(dividx, folderoffImg) {
    var imgName = folderoffImg.substring(0, folderoffImg.indexOf("."));
    // 펼치기
    if (eval("document.all.onmenuGroup"+ dividx).style.display == "none") {
        document.getElementById("menuGroupImg"+ dividx).src = g_imgsvr +"/community/common/menu/"+ imgName +"_open.gif";
        eval("document.all.onmenuGroup"+ dividx).style.display = "block";
    }
    // 접기
    else if (eval("document.all.onmenuGroup"+ dividx).style.display == "block") {
        document.getElementById("menuGroupImg"+ dividx).src = g_imgsvr +"/community/common/menu/"+ folderoffImg;
        eval("document.all.onmenuGroup"+ dividx).style.display = "none";
    }
}

function getUrlperMenu(objid, objurl, objseq) {
    var objidx;
    var menulink;

    if (objid.substr(0,4) == "GCOM") {
		objidx = parseInt(objid.substr(4,2),10)

		if (objidx == 1) menulink = g_commsvr + "/ComService/Activity/Notice/CsNoticeList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;           // 공지사항
		else if (objidx == 2) menulink = g_bbssvr + "/ComService/Activity/BBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;             // 게시판
		else if (objidx == 3) menulink = g_commsvr + "/ComService/Activity/PDS/CsPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;            // 자료실
		else if (objidx == 4) menulink = g_commsvr + "/ComService/Activity/GuestBook/CsGuestBookList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;// 방명록
		else if (objidx == 5) menulink = g_commsvr + "/ComService/Activity/Discuss/CsDiscussList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;    // 토론실
		else if (objidx == 6) menulink = g_commsvr + "/ComService/Activity/Calendar/CsCalViewMonth.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;  // 일정관리
		else if (objidx == 7) menulink = g_commsvr + "/ComService/Activity/Vote/CsVoteList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;          // 투표
		else if (objidx == 9) menulink = g_commsvr + "/ComService/Activity/Survey/CsSurveyList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;      // 설문
		else if (objidx == 11) menulink = g_playsvr + "/chat/PeCtRoomListComm.asp?grpid=" + g_curgrpid;                                             // 채팅
		else if (objidx == 13) menulink = g_commsvr + "/ComService/Activity/Album/CsPhotoList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq + "&grpurl=" + g_grpurl;// 앨범
		else if (objidx == 15) menulink = g_commsvr + "/ComService/Activity/CoolSite/CsCoolSites.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;    // 쿨사이트
		else if (objidx == 16) menulink = g_bbssvr + "/ComService/Activity/QnA/CsQnAList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;            // Q&A
		else if (objidx == 20) menulink = g_wwwsvr + "/ComService/Activity/SmallGroup/CsAliSmlList.asp?GrpId=" + g_curgrpid;                        // 소그룹활동
		else if (objidx == 22) menulink = g_bbssvr + "/ComService/Activity/EstimBBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;       // 추천게시판
		else if (objidx == 23) menulink = g_bbssvr + "/ComService/Activity/ABBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;           // 익명게시판
		else if (objidx == 30) menulink = g_commsvr + "/ComService/Activity/Pay/CsPayList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;           // 회비관리
		else if (objidx == 36) menulink = g_commsvr + "/ComService/Activity/Wi/Default.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;              // 무선서비스
		else if (objidx == 37) menulink = g_moimsvr + "/ComService/Activity/Moim/MoimBBS/MoMain.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;     // 번개정모게시판
		else if (objidx == 38) menulink = g_msgrsvr + "/p2p/PCommUserList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;                           // P2P 자료실
		else if (objidx == 45) menulink = g_commsvr + "/ComService/Activity/alliance/Csalliancelist.asp?GrpId=" + g_curgrpid + "&ObjSeq=1";         //회원정보
		else if (objidx == 51) menulink = "JavaScript:openMemo(" + objseq + ")";                                                                    //메모장
		else if (objidx == 53) menulink = g_commsvr + "/ComService/Activity/MasterPR/MasterPRDisplay.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;//마스터프로필
		else if (objidx == 55) menulink = g_commsvr + "/ComService/Activity/MPDS/CsMPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;         // 대용량자료실
		else if (objidx == 58) menulink = g_commsvr + "/ComService/Activity/VPDS/CsMPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;	        // 프리미엄자료실
		else if (objidx == 59) menulink = g_commsvr + "/ComService/Activity/VPDS/CsVPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;         // 기가자료실
		else if (objidx == 60) menulink = g_commsvr + "/ComService/Activity/VPDS/CsUPDSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;	        // 프리미엄익명
		else if (objidx == 61) menulink = g_commsvr + "/ComService/Activity/XBBS/CsBBSList.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;	        // 동영상게시판
        else if ((objidx == 47) || (objidx == 50)) {
            menulink = g_wwwsvr + "/" + g_grpurl + "/" + objurl;
		} 
		else if (objidx == 46) {
		    menulink = objurl;
		} 
		else if (objidx == 48) {
		    menulink = objurl;
		}
    }
    else if (objid.substr(0,4) == "XCOM") {
		objidx = parseInt(objid.substr(4,2),10)

		if (objidx == 6) menulink = "JavaScript:goNorazo()";
		else if(objidx == 9) menulink = g_wwwsvr + "/_market/BV/fc2bv.asp";
		else if(objidx == 15) menulink = g_mallsvr + "/AvtMall/AMMain.asp";
	}
	/* 방통대 메뉴 삭제
	else if (objid == "KNOU01") {
		menulink = g_wwwsvr + "/_knou/info/info.asp?GrpId=" + g_curgrpid;
	}*/
	else if (objid.substr(0,4) == "GETC") {		//숨겨진 메뉴처리
		objidx = parseInt(objid.substr(4,2),10)
		
		if (objidx == 1) menulink = g_wwwsvr + "/" + objurl + "/";                      //추천커뮤니티리스트
		else if (objidx == 3) menulink = "javascript:openSum(\"\",\"" + objurl + "\")"; //섬리스트
	}

    return menulink;
}

//메뉴 & Grouping 나타내기
function DisplayMenuInfo(classnm)
{
	var intShowWidth;
	var strGroupMenu;
	var strMenuName;
	var intCurGroupIndex;
	var intMenuCnt;
	var linkclassnm;
	var intObjseq, strImgHeader;
    var aryTemp, idx, customerStyle, frontStyle, backStyle;
    customerStyle = "";
    frontStyle = "";
    backStyle = "";
	idx = 0;

	if (g_mngpermission) return;

	if (typeof classnm == "undefined") {
		classnm = "mfunc"
		linkclassnm = "mlink"
	} else {
		linkclassnm = classnm
	}

	/**if (g_menuitem != "Y") {DisplayGETCInfo("menu");}
	else {DisplayGETCInfo(classnm);}
	**/
	/**if(!g_canapply && g_leftmenu.indexOf('L03')==-1) {
		document.write('<tr><td align=center><a href="' + g_homesvr + '/ComService/Activity/Invite/CsInviteMailForm.asp?GrpId=' + g_curgrpid + '">');
		(g_leftmenu.indexOf('L03')>-1)? document.write('<img src="'+ g_imgsvr +'/ComMenu/btn_01.gif" width=50 height=20>') : document.write('<img src="'+ g_imgsvr +'/ComMenu/btn1.gif" width=44 height=20>');
		document.write('</a><img src="' + g_imgsvr + '/1by1.gif" width=2><a href="' + g_homesvr + '/ComService/Activity/sum/makesum.asp?grpid=' + g_curgrpid + '">');
		(g_leftmenu.indexOf('L03')>-1)? document.write('<img src="'+ g_imgsvr +'/ComMenu/btn_02.gif" width=90 height=20>') : document.write('<img src="'+ g_imgsvr +'/ComMenu/btn2.gif" width=85 height=20>');
		document.write('</a>');
	}**/

	//설문이 있는지 확인.. 있으면 설문에만 New를 달아주기 위해서..  pirpor:start
	for (var i=0;i<g_menuinfo.length;i++) {
		if((g_menuinfo[i][5] == "" || g_menuinfo[i][5] == "N") && g_menuinfo[i][0] == "GCOM09")
			blGCOM09Exist = true;
	}
	//pirpor:end

    var folderonImg, folderoffImg;

	for (var i=0;i<g_menuinfo.length;i++) {
        if (g_menuinfo[i][0] != "GCOM45") {
    		if (g_menuinfo[i][0] == "GSTR") {//그룹메뉴제목
    			intObjseq = g_menuinfo[i][1]
    			intCurGroupIndex = g_menuinfo[i][4]-1;
    			intMenuCnt = 0;
    			intShowWidth = 123;
    
    			
                // 메뉴그룹
    			if (intObjseq >=0) {
    			    folderonImg = "ico_folder_open.gif";
    			    folderoffImg = "ico_folder.gif";
    			}
    			// 추천 커뮤니티
    			else if (intObjseq==-1) {
    			    folderonImg = "ico_comm_open.gif";
    		        folderoffImg = "ico_comm.gif";
    			}
    			// 우리 컴티 섬
    			else if(intObjseq==-2) {
    			    folderonImg = "ico_sum_open.gif";
    		        folderoffImg = "ico_sum.gif";
    			}

                // 메뉴그룹이거나 추천 컴티이면
                if (g_groupinfo[intCurGroupIndex][1] !=0 && g_groupinfo[intCurGroupIndex][3] != "GCOM57") {
//    			if (g_groupinfo[intCurGroupIndex][1] != 0 && g_groupinfo[intCurGroupIndex][3] != "GCOM57") {
/*******    메뉴 출력 개편 1차 2006-10-27 이전  *******
					if (g_menuinfo[i][5] == "Y") document.writeln("<li class='folder' style='padding:0 0 0 2Px'>");
					else document.writeln("<li class='folderon' style='padding:0 0 0 2Px'>");
    			    // 폴더 접기    =======
					document.writeln("  <a href=\"Javascript:viewNhide("+ intCurGroupIndex +", '"+ folderoffImg +"');\">");
    				// 메뉴그룹이면서 숨김이면, 메뉴숨김이 아니고 하위 메뉴 안 보이기임(원래 메뉴그룹은 숨기기를 할 수 없음)
    				if (g_menuinfo[i][5] == "Y") {
    				    document.write("    <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderoffImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
    				}
    			    else document.write("  <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderonImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
					document.writeln("  </a>");
    				// 스타일 적용
					document.writeln("  <a href=\"Javascript:viewNhide("+ intCurGroupIndex +", '"+ folderoffImg +"');\">");
    				if (g_menuinfo[i][9] != "") {
    				    document.write("<font style='"+ g_menuinfo[i][9] +"' id='grpTitle" + intCurGroupIndex +"'>"+ g_menuinfo[i][2]+"</font>");
    				}
    			    else document.write(g_menuinfo[i][2]);
					document.writeln("  </a>");
                        // 새 글 있으면 이미지 붙이기
                    if (g_groupinfo[intCurGroupIndex][2] == true) {
                        document.write("&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif'>");
                    }
                    // 기호가 있으면 붙이기
                    if (g_menuinfo[i][8] != "") {
                        document.write("&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + g_menuinfo[i][8] + "' border=0>");
                    }
                    // 하위 메뉴 표시 =======  
    				// Hideyn이 Y이면
    				document.write("<ul class='foldercate' Id='onmenuGroup"+ intCurGroupIndex +"'");
					if (g_menuinfo[i][5] == "Y") {
    				    document.write(" style='display:none'>");
    				}
    			    else document.write(" style='display:block'>");
*******/
                    // objid, objseq, funcnm

                    //===   메뉴그룹 또는 기타 폴더 시작    =======
					if (g_menuinfo[i][5] == "N") document.writeln("<li class='folderon'>");
					else document.writeln("<li class='folder'>");

                    // 그룹명 div 시작 및 사용자 지정 메뉴 스타일 적용
                    if (g_menuinfo[i][9] != "") {
                        document.writeln("  <div id='groupTitle"+ intCurGroupIndex +"' onClick=\"viewNhide("+ intCurGroupIndex +", '"+ folderoffImg +"');\" style='cursor:hand;" + g_menuinfo[i][9] +"'>");
                    }
                    else document.writeln(" <div id='groupTitle"+ intCurGroupIndex +"' onClick=\"viewNhide("+ intCurGroupIndex +", '"+ folderoffImg +"');\" style='cursor:hand;'>");
    
    				// 메뉴그룹이면서 숨김이면, 메뉴숨김이 아니고 하위 메뉴 안 보이기임.(원래 메뉴그룹은 숨기기를 할 수 없음)
    				if(g_groupinfo[intCurGroupIndex][3] != "GCOM52") {// 추천컴티가 아니면
    				    // 메뉴그룹 펼치기
                        if (g_menuinfo[i][5] != "Y") {
                            document.writeln("     <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderonImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
        				}
        				// 메뉴그룹 숨기기
        			    else document.writeln("     <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderoffImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
        			}
        			// 추천컴티는 펼치기
    			    else document.writeln("      <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderonImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");

//    				메뉴그룹인 경우 무조건 접기, 추천컴티는 펼치기(2006-11-03 By SOH)
/*                    if(g_groupinfo[intCurGroupIndex][3] != "GCOM52") {// 추천컴티가 아니면
                        document.writeln("      <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderoffImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
                    }
                    else document.writeln("     <img src='"+ g_imgsvr +"/community/common/Menu/"+ folderonImg +"' Id='menuGroupImg"+ intCurGroupIndex +"'>");
*/
    			    if (g_menuinfo[i][9].length >0) {
                        aryTemp = g_menuinfo[i][9].split("; ");
    
                        for(idx = 0; idx<aryTemp.length; idx++) {
                            aryTemp[idx] = aryTemp[idx].replace(";", "");

                            frontStyle = aryTemp[idx].substring(0, aryTemp[idx].indexOf(":"));
                            backStyle  = aryTemp[idx].substring(aryTemp[idx].indexOf(":")+1);
    
                            customerStyle += "this.style.";
                            if(frontStyle.indexOf("-") >-1) {
                                customerStyle += frontStyle.substring(0,frontStyle.indexOf("-")) + frontStyle.substr(frontStyle.indexOf("-")+1,1).toUpperCase() + frontStyle.substring(frontStyle.indexOf("-")+2) + "='"+ backStyle +"'; ";
                            }
                            else customerStyle += frontStyle + "='"+ backStyle +"'; ";
                        }
                    }
                    else customerStyle = "this.style.textDecoration='none';"
                    document.writeln("          <span onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\""+ customerStyle + "\">"+ g_menuinfo[i][2] +"</span>");

                    // 기호가 있으면 붙이기
                    if (g_menuinfo[i][8] != "") {
                        document.write("&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + g_menuinfo[i][8] + "' border=0>");
                    }
                    // 새 글 있으면 이미지 붙이기
                    if (g_groupinfo[intCurGroupIndex][2] == true) {
                        document.write("&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif'>");
                    }
                    document.writeln("      </div>");    
                    // 하위 메뉴 표시 =======  
                    // 메뉴그룹인 경우 무조건 접기, 추천컴티는 펼치기(2006-11-03 By SOH)
                    if(g_groupinfo[intCurGroupIndex][3] != "GCOM52") {// 추천컴티가 아니면
        				// Hideyn이 Y이면
        				if (g_menuinfo[i][5] == "Y") {
                            document.writeln("  <div id='onmenuGroup" + intCurGroupIndex +"' style=\"display:none;padding:7px 0 0 0\">");
                            document.writeln("      <table cellpadding='0' cellspacing='2' border='0'>");
                        }
                        else {
                            document.writeln("  <div id='onmenuGroup" + intCurGroupIndex +"' style=\"display:block;padding:7px 0 0 0\">");
                            document.writeln("      <table cellpadding='0' cellspacing='2' border='0'>");
                        }
                    }
                    else {
                        document.writeln("  <div id='onmenuGroup" + intCurGroupIndex +"' style=\"display:block;padding:7px 0 0 0\">");
                        document.writeln("      <table cellpadding='0' cellspacing='2' border='0'>");
                    }
                    customerStyle = "";
    			}
                //===   메뉴그룹 또는 기타 폴더 끝  =======
    		}else if(g_menuinfo[i][0] != "GETC03") { //일반메뉴
/*******    메뉴 출력 개편 1차 2006-10-27 이전  *******
    	        // 메뉴그룹 끝이면
    			if (g_menuinfo[i][0] == "GEND") {
					//메뉴그룹 닫는다
					if ((g_groupinfo[intCurGroupIndex][1] != 0 && g_groupinfo[intCurGroupIndex][3] != "GCOM57")) { 
					document.writeln("</ul>");
					document.writeln("</li>");
					}
    				continue;
    			}
    			if (g_menuinfo[i][5] == "" || g_menuinfo[i][5] == "N") {
    				strMenuName = GetMenuName(intShowWidth, g_menuinfo[i][0], g_menuinfo[i][1], g_menuinfo[i][2], g_menuinfo[i][3], true, linkclassnm, g_menuinfo[i][7], g_menuinfo[i][8], g_menuinfo[i][9]);
    				// 메뉴그룹 내 하위 메뉴 표시
					if ((g_menuinfo[i][4].length > 0) && (strMenuName != "")) {
						document.writeln("<li class='subcate'><a href='" + getUrlperMenu(g_menuinfo[i][0], g_menuinfo[i][7],g_menuinfo[i][1]) + "'>");
        				if (g_menuinfo[i][9] != "") {
        				    document.write("<font style='"+ g_menuinfo[i][9] +"'>" + g_menuinfo[i][2] +"</font></a>");
        				}
        			    else document.write(g_menuinfo[i][2] +"</a>");
        			    // 새 글 있으면 이미지 붙이기
                        if (g_menuinfo[i][3] == "1") {
                            document.write("&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif'>");
                        }
                        // 기호가 있으면 붙이기
                        if (g_menuinfo[i][8] != "") {
                            document.write("&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + g_menuinfo[i][8] + "' border=0>");
                        }
						document.writeln("</li>");       				
    				}
    				else {
    					if (strMenuName != "" && typeof strMenuName != "undefined") {
    					    if (g_menuinfo[i][0] != "GCOM49") {
    					        document.writeln(strMenuName);
    					    }
    					    else if (g_menuinfo[i][0] == "GCOM49") {
    					        DispalyMenuGbn(strMenuName, g_menuinfo[i][2], classnm, g_menuinfo[i][9]);
    					    }
    					}
    				}
    			}
*******/
                // 메뉴그룹 끝이면
    			if (g_menuinfo[i][0] == "GEND") {
					//메뉴그룹 닫는다
					if ((g_groupinfo[intCurGroupIndex][1] != 0 && g_groupinfo[intCurGroupIndex][3] != "GCOM57")) { 
    					document.writeln("      </table>");
    					document.writeln("	</div>");
    					document.writeln("</li>");
    			    }
    					continue;
		        }
		        // 숨김메뉴가 아니면
                if (g_menuinfo[i][5] != "Y") {
    				strMenuName = GetMenuName(intShowWidth, g_menuinfo[i][0], g_menuinfo[i][1], g_menuinfo[i][2], g_menuinfo[i][3], true, linkclassnm, g_menuinfo[i][7], g_menuinfo[i][8], g_menuinfo[i][9]);

    				// 메뉴그룹 내 하위 메뉴 표시
					if ((g_menuinfo[i][4].length > 0) && (strMenuName != "")) {
					    document.writeln("<tr>");
					    document.write("  <td style='padding:0 3px 3px 0;'><img src='" + g_imgsvr + "/community/common/white/ico_d01.gif'>");
					    // 사용자 지정 스타일 설정
					    if (g_menuinfo[i][9] != "") {
					        aryTemp = g_menuinfo[i][9].split("; ");

                            for(idx = 0; idx<aryTemp.length; idx++) {
                                aryTemp[idx] = aryTemp[idx].replace(";", "");

                                frontStyle = aryTemp[idx].substring(0, aryTemp[idx].indexOf(":"));
                                backStyle  = aryTemp[idx].substring(aryTemp[idx].indexOf(":")+1);

                                customerStyle += "this.style.";
                                if(frontStyle.indexOf("-") >=0) {
                                    customerStyle += frontStyle.substring(0,frontStyle.indexOf("-")) + frontStyle.substr(frontStyle.indexOf("-")+1,1).toUpperCase() + frontStyle.substring(frontStyle.indexOf("-")+2);
                                }
                                else customerStyle += frontStyle;

                                customerStyle += "='"+ backStyle +"'; ";
                            }

					        document.write("    <a href='"+ getUrlperMenu(g_menuinfo[i][0], g_menuinfo[i][7],g_menuinfo[i][1]) +"' style='"+ g_menuinfo[i][9] +"'><span onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\""+ customerStyle +"\">"+ g_menuinfo[i][2] +"</span></a>");
					    }
					    else document.write("    <a href='"+ getUrlperMenu(g_menuinfo[i][0], g_menuinfo[i][7],g_menuinfo[i][1]) +"'><span onmouseover=\"this.style.textDecoration='underline';\" onmouseout=\"this.style.textDecoration='none';\">"+ g_menuinfo[i][2] +"</span></a>");

                        // 기호가 있으면 붙이기
                        if (g_menuinfo[i][8] != "") {
                            document.write("&nbsp;<img src='" + g_imgsvr + "/Commenu/Icon/" + g_menuinfo[i][8] + "' border=0>");
                        }
        			    // 새 글 있으면 이미지 붙이기
                        if (g_menuinfo[i][3] == "1") {
                            document.write("&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif'>");
                        }

						document.writeln("</tr>");
						customerStyle = "";
    				}
    				else {
    					if (strMenuName != "" && typeof strMenuName != "undefined") {
    					    if (g_menuinfo[i][0] != "GCOM49") {
    					        document.writeln(strMenuName);
    					    }
    					    else if (g_menuinfo[i][0] == "GCOM49") {
    					        DispalyMenuGbn(strMenuName, g_menuinfo[i][2], classnm, g_menuinfo[i][9]);
    					    }
    					}
    				}
    			}
    		}
			/** 우리 컴티섬 메뉴 삭제 061011 by tauris
    		// 유료컴티이면서 우리 컴티섬이거나 숨겨진 메뉴이면
    		else if(g_commtype =="P" && g_menuinfo[i][0] == "GETC03") {
    			if (g_menuinfo[i][5] == "" || g_menuinfo[i][5] == "N") {
    				if (g_menuinfo[i][4] != "") {intShowWidth = 112;}
    				else {intShowWidth = 123;}
    
    				strMenuName = GetMenuName(intShowWidth, g_menuinfo[i][0], g_menuinfo[i][1], g_menuinfo[i][2], g_menuinfo[i][3], true, linkclassnm, g_menuinfo[i][7], g_menuinfo[i][8], g_menuinfo[i][9]);
    				document.writeln(strMenuName);
    			}
    		}
			**/
    	}
    }
}

//사용자 정의 페이지 나타내기
function DisplayHomeInfo(classnm)
{
	var linkclassnm;

	if (typeof classnm == "undefined") {
		classnm = "mtitle"
		linkclassnm = "mlink"
	} else {
		linkclassnm = classnm
	}

	for (var i=0;i<g_homeinfo.length;i++) {
		document.writeln('<tr height=18><td class="' + classnm + '">&nbsp;<img src="' + g_imgsvr + '/ComMenu/home.gif" border="0" align="texttop" width="12" height="12">&nbsp;<a href="' + g_wwwsvr + '/' + g_grpurl + '/' + g_homeinfo[i][0] + '" class="' + linkclassnm + '">' + g_homeinfo[i][1] + '</a></td></tr>')
	}
}

function GetMngMenuName(spanwidth, objid, objseq, funcnm, isnew, linkclassnm, objimg, objcss)
{
	var objidx;
	var menulink;
	var tailimg;
	var returnval;

	tailimg = ""
	returnval = ""

	if (objid == "GCOM14") {funcnm = "회원정보"; spanwidth = (spanwidth/2)-12}
	else if (objid == "GCOM54") {funcnm = "커뮤니티캐쉬";}

	if ((objid.substr(0,4) == "GCOM") || (objid.substr(0,4) == "GMAN"))  {
		objidx = parseInt(objid.substr(4,2),10)
		switch (objidx) {
			case 14: menulink = g_commsvr + "/ComService/Activity/Address/CsAddrAll.asp?grpid=" + g_curgrpid;menuclass="memberinfo";break; //회원정보검색
			//case 19: menulink = g_homesvr + "/ComService/Activity/MyData/CsActNfoModify.asp?GrpId=" + g_curgrpid;menuclass="memberinfo"; break;  //자기정보관리
			case 54: menulink = g_homesvr + "/ComService/Management/Manage/CommunityHP/Support/GetPointMaster.asp?grpid=" + g_curgrpid;menuclass="commcash"; break;  //마스터후원하기
			case 56: menulink = g_commsvr + "/ComService/Activity/birthzone/CsBirthZone.asp?grpid=" + g_curgrpid;menuclass="birthday"; break; //생일존
			default: menulink = ""; break;
		}
		
		if (menulink != "") {
			returnval += "<li class='" + menuclass + "'>"
			
			if ((objidx == "00") && (g_mngnew == "1")) {
				tailimg = "&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif' border=0 align='texttop'>"
			} else {
				if (isnew == "1") {
					if (objidx == "56") tailimg = "&nbsp;<img src='" + g_imgsvr + "/comservice/activity/birthmsg/birth_ico_b.gif' border=0 width=11 height=11 align='texttop'>";
					else tailimg = "&nbsp;<img src='" + g_imgsvr + "/community/common/ico_n.gif' border=0 align='texttop'>";
				}
			}
			returnval += "<a href='" + menulink + "' class='" + linkclassnm + "' style='" + objcss + "' align='texttop'>" + funcnm + "</a>"
			returnval += tailimg
			returnval += "</li>"

		}else{
			//returnval += "<li>"
		}	
		
		if ((objid == "GCOM14")) return returnval;
		else if (returnval != "") return DisplayFreeCommMenu(returnval, spanwidth);
	}
}

//커뮤니티 관리메뉴 나타내기
function DisplayGeneralInfo(classnm)
{
	var linkclassnm;
	var strobjinfo;

	if (g_mngpermission)
		return;

	if (typeof classnm == "undefined") {
		classnm = "mtitle"
		linkclassnm = "mlink"
	} else {
		linkclassnm = classnm
	}

	//커뮤니티 라이브 세팅 - js/commitem/commenu.js로 옮김 20060907 by korean
	/*if ((g_login == true) && (g_freechalon == "2") && (g_menuitem != "Y")) {
		DisplayCommLive("mtitle", "mfunc", "mlink", g_frameheight);
	}*/
	if (g_mngmenuinfo.length > 0) {
		for (var i=0;i<g_mngmenuinfo.length;i++) {
			if (g_mngmenuinfo[i][4] != "Y") {
				if (g_mngmenuinfo[i][0] == "GCOM54" && g_grpcatGbn != "G") {
					document.writeln('<li class="commcash"><a href="' + g_homesvr + '/ComService/Management/Manage/CommunityHP/Support/GetPointMaster.asp?grpid=' + g_curgrpid + '">커뮤니티 캐쉬</a>&nbsp;<img src="' + g_imgsvr + '/community/common/ico_n.gif" border=0 align="texttop"></li>');
				}
				
				strobjinfo = GetMngMenuName(123, g_mngmenuinfo[i][0], g_mngmenuinfo[i][1], g_mngmenuinfo[i][2], g_mngmenuinfo[i][3], linkclassnm, g_mngmenuinfo[i][6], g_mngmenuinfo[i][7]);
				if ((g_mngmenuinfo[i][0] == "GCOM14")) {
					document.write(strobjinfo);
					
				} else {
					
					if ((g_mngmenuinfo[i][0] == "GCOM56"))
					{
						document.write(strobjinfo);
					}
					if ((g_mngmenuinfo[i][0] == "GCOM21"))
					{
						document.writeln('<li class="invite"><a href="' + g_commsvr + '/ComService/CommTextAD/FreeADLogCheck.asp?grpurl=' + g_grpurl + '&logurl=' + g_homesvr + '/ComService/Activity/Invite/CsInviteMailForm.asp?GrpId=' + g_curgrpid + '">초대하기</a></li>');
					}
					

				}
			}
		}
	} else {
		document.writeln('<li class="birthday"><a href="' + g_commsvr + '/ComService/Activity/birthzone/CsBirthZone.asp?grpid=' + g_curgrpid + '" class="' + linkclassnm + '">추카추카!</a></li>');
		if (g_grpcatGbn != "G"){
			document.writeln('<li class="commcash"><a href="' + g_wwwsvr + '/ComService/Management/Manage/CommunityHP/Support/GetPointMaster.asp?grpid=' + g_curgrpid + '" class="' + linkclassnm + '">커뮤니티캐쉬</a></li>');
		}
		document.writeln('<li class="invite"><a href="' + g_commsvr + '/ComService/CommTextAD/FreeADLogCheck.asp?grpurl=' + g_grpurl + '&logurl=' + g_homesvr + '/ComService/Activity/Invite/CsInviteMailForm.asp?GrpId=' + g_curgrpid + '">초대하기</a></li>');
		document.writeln('<li class="memberinfo"><a href="' + g_commsvr + '/ComService/Activity/Address/CsAddrAll.asp?grpid=' + g_curgrpid + '" class="' + linkclassnm + '">회원정보</a></li>');
	}
}

//커뮤니티 용량선물
function buyStorage()
{
	if (g_login == true) {
		window.open("/common/storage/CsBuyStoragePrev.asp?grpid="+g_curgrpid+"&returnurl=no", "buyprocess", "fullscreen=no,titlebar=no,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=300");
	} else {
		alert("로그인하세요.")
		return;
	}
}

//인증 이미지 나타내기
function DisplayCertifyImage()
{
	var arrCertifyImage = Array("o", "c", "a", "d", "m")
	var arrCertifyLink = Array("CerResultOfficial.asp", "CerResultActivity.asp?ApplyGbn=C", "CerResultActivity.asp?ApplyGbn=A", "CerResultActivity.asp?ApplyGbn=D", "CerResultMania.asp")
	document.write('<div class="fl" style="padding:8px 0px 0px 5px;">');
	if (g_trialyn == "Y") {
		document.write('<a href="' + g_homesvr + '/etc/3thousand/MembershipLounge/JoinInfo.asp" target=_blank><img src="' + g_imgsvr + '/ComMenu/trial.gif" width=81 height=15></a>') // ask ayasiee
	} else {
		for (var i=0;i<g_certinfo.length;i++) {
			if (g_certinfo.substr(i,1) == "Y") {
				document.write('<a href="'+ g_commsvr + '/Certify/' + arrCertifyLink[i] + '" target=_blank><img src="' + g_imgsvr + '/community/common/ico_attest_' + arrCertifyImage[i] + '.gif" border="0" align=absmiddle></a>');
			}
		}
	}
	document.write('</div>')
}

//관리 상세메뉴 표시
function DisplayMngMenu()
{
	var linkclassnm;
	var strObjid = g_objid.substring(0, 4);
	var strMngUrl = g_homesvr + "/ComService/Management";

	if (g_mngpermission == true) {
                          
		document.writeln('<li class="admintitle">초기화면 관리</li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/HtmlUpload/free_mngsite.asp?grpid=' + g_curgrpid + '" title="커뮤니티 초기화면을 꾸미고 관리합니다.">메인 템플릿 관리</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/Color/makeSkin.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 스킨과 마우스효과 아이템을 사용합니다.">스킨/디자인 관리</a>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/CoverStory/CoverStoryList.asp?GrpId=' + g_curgrpid + '" title="커뮤니티 커버스토리 꾸미고 관리합니다.">커버스토리 관리</a></li>')
//		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/Color/makeMenu.asp?grpid=' + g_curgrpid + '" title="게시판의 색상을 수정합니다.">게시판 색상 관리</a></li>')
//		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/CommLive/CsCommBGM.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 배경음악을 설정합니다.">배경 음악 관리</a></li>')
		document.writeln('<li class="categoryBGLine"><!--  --></li>')
		
		document.writeln('<li class="admintitle">커뮤니티 정보 관리</li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Information/GeneralInfo/CsMngBasGeneral.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 이름, 소개말, 운영규칙 등의 정보를 수정합니다.">기본 정보 관리</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Manage/Capacity/CsBuyComm.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 용량 사용 현황을 확인합니다.">커뮤니티 용량 관리</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Information/Statistics/CsStatisticsList.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 방문자 및 게시물 활동 통계 정보를 확인합니다.">커뮤니티 통계 관리</a></li>')
		if (g_grpcatGbn != "G") //클랜과 같은 종류가 아닌 일반 커뮤니티에만 보임
		{
			document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Information/MasterChange/CsMngBasSysop.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 마스터를 다른 회원으로 변경합니다.">마스터 변경하기</a></li>');
			document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Information/CommunityClose/CsMngClose.asp?Grpid=' + g_curgrpid + '" title="커뮤니티를 폐쇄합니다.">커뮤니티 폐쇄</a></li>');
		}	
		document.writeln('<li class="categoryBGLine"><!--  --></li>')

		document.writeln('<li class="admintitle">메뉴 기능 관리</li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/Setting/CsMngFuncMain.asp?grpid=' + g_curgrpid + '" title="메뉴의 추가/삭제/이름변경 및 순서 조정과 꾸미기 설정합니다.">메뉴 관리</a></li>')
		document.writeln('<li class="catetitle"><a href="' + g_bbssvr + '/ComService/Activity/delBBS/CsBBSDeleteList.asp?GrpId=' + g_curgrpid + '" title="삭제 권한에 의해 삭제된 게시물을 확인하고 복원할 수 있습니다.">삭제 게시물 관리</a></li>')
		//document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/CommLive/CsCommLive.asp?Grpid=' + g_curgrpid + '" title="실시간 접속회원 보기 서비스의 이용여부와 형태를 설정합니다.">커뮤니티라이브 설정</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/ADYN/CsADYNMenu.asp?Grpid=' + g_curgrpid + '" title="회원정보검색 메뉴의 이용여부를 설정합니다.">회원정보 검색 설정</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Menu/ADYN/CsBirthYNMenu.asp?Grpid=' + g_curgrpid + '" title="추카추카 메뉴와 팝업 알림의 이용여부를 설정합니다.">추카추카 설정</a></li>')
		//document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Information/Mobile/CsMobileMng.asp?Grpid=' + g_curgrpid + '" title="핸드폰으로 커뮤니티 접속하였을 경우 보여지는 메뉴 순서를 관리합니다.">무선 컴티 메뉴 설정</a></li>')
		document.writeln('<li class="categoryBGLine"><!--  --></li>')
		
        document.writeln('<li class="admintitle">회원 관리</li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Member/ApplyAndModify/CsMngMemList.asp?grpid=' + g_curgrpid + '" title="커뮤니티 회원, 가입신청자, 탈퇴자 정보를 관리합니다.">커뮤니티 회원 보기</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Member/Entry/CsMngMemEntMethod.asp?grpid=' + g_curgrpid + '" title="회원가입방법과 가입입력항목을 수정합니다.">가입 방법 변경</a></li>')
		document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Member/GroupSend/CsGroupMsg.asp?grpid=' + g_curgrpid + '" title="커뮤니티 회원에게 전체 메일, 쪽지, 문자메세지를 보냅니다.">단체 메세지 보내기</a></li>')
		if (g_grpcatGbn != "G") { 
			document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Member/Greeting/CsMngMemGreeting.asp?grpid=' + g_curgrpid + '" title="커뮤니티 활동과 관련하여 자동발송되는 안내 메일을 관리합니다.">안내 메일 설정</a></li>')
		}
		document.writeln('<li class="categoryBGLine"><!--  --></li>')
		
		if (g_grpcatGbn != "G") //클랜과 같은 종류가 아닌 일반 커뮤니티에만 보임
		{
				document.writeln('<li class="admintitle">제휴그룹/소그룹</li>')
				document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Manage/Alliance/Parallel/AlListatusList.asp?Grpid=' + g_curgrpid + '" title="다른 커뮤니티와 제휴를 신청하고 제휴 현황을 관리합니다.">제휴 관리</a></li>')
				document.writeln('<li class="catetitle"><a href="' + strMngUrl + '/Manage/SmallGroup/CsAliSmlMngList.asp?grpid=' + g_curgrpid + '" title="커뮤니티 내의 소그룹을 생성, 관리, 삭제합니다.">소그룹 관리</a></li>')
		}
	}
}

// 숫자 표시
function FormatNumber(nNumber)
{
	var nMod, nDiv, bMinus;
	var strNumber;

	if (nNumber == 0) return "0";
	strNumber = "";

	nDiv = nNumber;
	bMinus = (nDiv < 0);
	if (bMinus) nDiv = -1 * nDiv;

	while (nDiv >= 1000) {
		var tmp;

		nMod = nDiv % 1000;
		nDiv = Math.floor(nDiv / 1000);
		if (strNumber.length > 0) strNumber = "," + strNumber;
		tmp = "000" + nMod;
		strNumber = tmp.substring(tmp.length-3, tmp.length) + strNumber;
	}

	if (nDiv > 0) {
		if (strNumber.length > 0) strNumber = "," + strNumber;
		strNumber = "" + nDiv + strNumber;
	}
	if (bMinus) strNumber = "-" + strNumber;
	return strNumber;
}

//커뮤니티게임
function goNorazo()
{
    var goGame = confirm("보다 나은 서비스 제공을 위해 커뮤니티 게임 기능이 중지됩니다.\n다양한 게임을 즐기실 수 있는 노라조 홈으로 이동하시겠습니까?")

    if (goGame == true) document.location.href = g_norazosvr;
}

//메뉴구분 Display 하기
function DispalyMenuGbn(str, fnm, classnm, fontcss) {
    //if (g_menuwidth < str.length*15) str = str.substr(0, Number(g_menuwidth)/15);

    if (g_menuitem == "N") {
        if (fnm == "default") document.writeln('<li class="categoryLine"><!--  --></li>');
        else document.writeln('<tr><td align=center class="' + classnm + '" style="' + fontcss + '" vAlign=baseline>' + str + '</td></tr>');


    } else {
        if (fnm != "default") document.writeln('<tr><td height=18 align=center class="' + classnm + '" style="' + fontcss + '" vAlign=baseline>' + str + '</td></tr>');
    }
}

//무료커뮤니티 g_menuwidth에 맞춰서 메뉴자르기
function DisplayFreeCommMenu(str, width) {
	if ((g_commtype == "F") && (g_menuitem == "N")) {
		if (g_menuwidth != 150) width += (g_menuwidth-150);
		//return "<span style='overflow:hidden; width:" + width + ";'>" + str + "</span>";
		return str;
	} else {
		return str;
	}
}

//무료커뮤니티의 이미지광고
function DisplayFreechalAD() {
	document.writeln('<table border=0 cellpadding=0 cellspacing=0 width="100%">');
	document.writeln('<tr><td height=18 style="padding-left:7px"><img src="' + g_imgsvr + '/ComMenu/Advertise/ad_help.gif" width=12 height=12 align=texttop>&nbsp;<a href="' + g_helpsvr + '/HdSearchByCat.asp?lcat=2&mcat=3&scat=1" class="mlink" target="_new">커뮤니티 도우미</a></td></tr>');
	document.writeln('<tr><td height=18 style="padding-left:7px"><img src="' + g_imgsvr + '/ComMenu/Advertise/ad_make.gif" width=12 height=12 align=texttop>&nbsp;<a href="' + g_commsvr + '/MakeComm/Default.asp" target="_new" class="mlink" target="_new">커뮤니티 만들기</a>&nbsp;<img src="' + g_imgsvr + '/ComMenu/up2.gif" border=0 width=11 height=11 align="texttop"></td></tr>');
	//document.writeln('<tr><td height=18 style="padding-left:7px"><img src="' + g_imgsvr + '/ComMenu/won.gif" width=12 height=12 align=texttop>&nbsp;<a href="' + g_homesvr + '/ComService/Management/PayService/Product/CsPayInformation.asp?grpid='+ g_curgrpid + '" class="mlink">커뮤니티 유료아이템</a></td></tr>');
	document.writeln('</table>');
}

//메모장 팝업띄우기
function openMemo(objseq) {
	var strUrl = g_commsvr + "/ComService/Activity/Memo/CsMemoView.asp?GrpId=" + g_curgrpid + "&ObjSeq=" + objseq;
	var winoption = 'width=640,height=385,fullscreen=no,titlebar=no,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes';

	window.open(strUrl, 'memowindow', winoption);
}

//커뮤니티 라이브
function DisplayCommLive(titleclassnm, funcclassnm, linkclassnm, frameheight) {

	if (g_mngpermission)
		return;

	if (navigator.appName == "Netscape") return;

	var lngDivWidth;
	var strStyle;

	if (g_menuitem  == "Y") {
		lngDivWidth = "97%"
	}

	strStyle = ".commlive_scroll{" & +
			   " scrollbar-arrow-color: #666666; " +
			   " scrollbar-3dlight-color: #666666; " +
			   " scrollbar-highlight-color: #ffffff;" +
			   " scrollbar-face-color: #ebebeb; " +
			   " scrollbar-shadow-color: #666666; " +
			   " scrollbar-track-color: #ffffff;" +
			   " scrollbar-darkshadow-color: #ffffff;" +
			   "}";
	document.writeln("<style type='text/css'>" + strStyle + "</style>");

	//커뮤니티 라이브 세팅
	if ((g_login == true) && (g_freechalon == "2")) {
		document.writeln('<tr><td valign=top class="' + funcclassnm + '">');
		document.writeln('<table border=0 cellpadding=0 cellspacing=0 class="' + funcclassnm + '" width="100%" height="' + frameheight + '">')
		document.writeln('<tr>')
		document.writeln('<td height=24 class="' + titleclassnm + '">&nbsp;<img src="' + g_imgsvr + '/ComMenu/freechalon/member.gif" border=0 width=12 height=12 align="texttop">&nbsp;<font style="font-weight:bold;">접속회원(<a id="userCnt" class="' + titleclassnm + '"></a>)</font>')

		if (navigator.appName != "Netscape") {
			document.write('&nbsp;<a ')
			if (g_hidecommlive == true) {
				document.write('href="javascript:SetCookie(\'CommLive\', \'Y\');"><img src="' + g_imgsvr + '/ComMenu/freechalon/down_s.gif"')
			} else {
				document.write('href="javascript:SetCookie(\'CommLive\', \'N\');"><img src="' + g_imgsvr + '/ComMenu/freechalon/up_s.gif"')
			}
			document.write('align="texttop" border=0 width=11 height=10></a>')
		}

		document.writeln('</td>')
		document.writeln('</tr>')
		if (g_hidecommlive != true) {
			document.writeln('<tr><td class="' + funcclassnm + '" align=left valign=top height=63>')
			document.writeln('<div id="FL_userList" class="commlive_scroll" style="width:' + lngDivWidth + ';height:62px;overflow:auto;text-align:left;padding:5px;"></div>');
			document.writeln('</td></tr>')
			document.writeln('<tr><td background="' + g_imgsvr + '/ComMenu/freechalon/bg_dot.gif" height=1></td></tr>')
			document.writeln('<tr>')
			document.write('<td height=20 align=right valign=bottom>')
			if (g_chatmenu == true) {
				document.write('<a href="' + g_playsvr + '/chat/PeCtRoomListComm.asp?grpid=' + g_curgrpid + '" class="' + linkclassnm + '" target="_top"><img src="' + g_imgsvr + '/ComMenu/freechalon/btn_chat.gif" border=0 width=41 height=14 align=absmiddle></a><img src="' + g_imgsvr + '/1by1.gif" border=0 width=3 height=1>')
			}
			document.write('<a href="' + g_homesvr + '/ComService/Management/Menu/CommLive/CsCommLive.asp?Grpid=' + g_curgrpid + '" title="커뮤니티 라이브 설정 변경"><img src="' + g_imgsvr + '/ComMenu/freechalon/btn_modify.gif" border=0 width=16 height=14 align=absmiddle></a><img src="' + g_imgsvr + '/1by1.gif" border=0 width=3 height=1>');
			document.write('<a href="javascript:HelpPopUp(\'2|5|1|6\');" title="도움말"><img src="' + g_imgsvr + '/ComMenu/freechalon/btn_qa.gif" border=0 width=16 height=14 align=absmiddle></a><img src="' + g_imgsvr + '/1by1.gif" border=0 width=3 height=1>');
			document.write('</td>')
			document.writeln('</tr>')
			document.writeln('<tr><td height=2></td></tr>')
		}
		document.writeln('</table>')

		document.writeln('</td></tr>');
		if ((g_menuitem != "Y") || ((g_menuitem  == "Y") && (navigator.appName == "Netscape"))) {
			document.writeln('<tr><td class="menu" height=6><img src="' + g_imgsvr + '/1by1.gif" border=0 width=1 height=1></td></tr>');
		} else {
			if (g_menuitem != "Y") document.writeln('<tr><td height=5><img src="' + g_imgsvr + '/1by1.gif" border=0 width=1 height=1></td></tr>');
		}

		if (navigator.appName != "Netscape") {
			g_layername = document.all['FL_userList'];
			g_layerusercnt = document.all['userCnt'];
		}

		makeList(g_userid, g_hname, g_layername, g_layerusercnt, linkclassnm);
	}
}

// 프리챌과의 연결고리
function DisplayFreechalLink() {
	if (g_grpcatGbn != "G")
	{
		//document.writeln('		<li><a href="' + g_commsvr + '/Base/AfterBBS/FCCMBBSList.asp?GrpId=0&ObjSeq=44"><img src="' + g_imgsvr + '/community/admin/btn_pr.gif" width="130" height="21" alt="" border="0"></a></li>')
		//document.writeln('		<li><a href="' + g_commsvr + '/certify/CerSubmitForm.asp"><img src="' + g_imgsvr + '/community/admin/btn_certify.gif" width="130" height="21" alt="" border="0"></a></li>')

	}
	document.writeln('		<li><a href="' + g_homesvr + '/Comservice/Management/Manage/MPDS/CsMpdsRequestForm.asp?GrpId=' + g_curgrpid + '"><img src="' + g_imgsvr + '/community/admin/btn_mpds.gif" width="130" height="21" alt="" border="0"></a></li>')
		
	//document.writeln("<tr><td align='center'><a href='" + g_homesvr + "/ComService/Community/anounce/bbs/FcCmBBSList.asp?GrpId=0&ObjSeq=44'><img src='" + g_imgsvr + "/ComMenu/left_btn1.gif' border='0'/></a></td></tr>");
	//document.writeln("<tr><td align='center'><a href='" + g_helpsvr + "'><img src='" + g_imgsvr + "/ComMenu/left_btn2.gif' border='0'/></a></td></tr>");
	//document.writeln("<tr><td align='center'><a href='" + g_commsvr + "/certify/CerSubmitForm.asp'><img src='" + g_imgsvr + "/ComMenu/left_btn3.gif' border='0'/></a></td></tr>");
	//document.writeln("<tr><td align='center'><a href='" + g_homesvr + "/Comservice/Management/Manage/MPDS/CsMpdsRequestForm.asp?GrpId=" + g_curgrpid + "'><img src='" + g_imgsvr + "/ComMenu/left_btn4.gif' border='0'/></a></td></tr>");
}

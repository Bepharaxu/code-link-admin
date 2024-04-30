//==本JS是加载Lodop插件及CLodop服务的综合示例，可直接使用，建议看懂后融进自己页面程序==
import { Modal, Message } from 'ant-design-vue'


var CreatedOKLodopObject, CLodopIsLocal, CLodopJsState;

//==判断是否需要CLodop(那些不支持插件的浏览器):==
function needCLodop () {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i))
            return true;
        if (ua.match(/iPhone|iPod|iPad/i))
            return true;
        if (ua.match(/Android/i))
            return true;
        if (ua.match(/Edge\D?\d+/i))
            return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((!verTrident) && (!verIE) && (x64))
            return true;
        else if (verFF) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 41) || (x64))
                return true;
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32)
                return true;
        } else if ((!verTrident) && (!verIE)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 41)
                    return true;
            }
        }
        return false;
    } catch (err) {
        return true;
    }
}

//加载CLodop时用双端口(http是8000/18000,而https是8443/8444)以防其中某端口被占,
//主JS文件“CLodopfuncs.js”是固定文件名，其内容是动态的，与当前打印环境有关:
function loadCLodop () {

    if (CLodopJsState == "loading" || CLodopJsState == "complete") return;
    CLodopJsState = "loading";
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var JS1 = document.createElement("script");
    var JS2 = document.createElement("script");

    if (window.location.protocol == 'https:') {
        JS1.src = "https://localhost.lodop.net:8443/CLodopfuncs.js";
        JS2.src = "https://localhost.lodop.net:8444/CLodopfuncs.js";
    } else {
        JS1.src = "http://localhost:8000/CLodopfuncs.js";
        JS2.src = "http://localhost:18000/CLodopfuncs.js";
    }
    JS1.onload = JS2.onload = function () { CLodopJsState = "complete"; }
    JS1.onerror = JS2.onerror = function (evt) { CLodopJsState = "complete"; }
    head.insertBefore(JS1, head.firstChild);
    head.insertBefore(JS2, head.firstChild);
    CLodopIsLocal = !!((JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i));
}

if (needCLodop()) { loadCLodop(); } //开始加载

//==获取LODOP对象主过程,判断是否安装、需否升级:==
function getLodop (oOBJECT, oEMBED) {
    var strHtmInstall = "打印控件CLodop未安装! 请先下载并执行安装, 安装后请刷新页面或重新进入。";
    var strHtmUpdate = "打印控件CLodop需要升级! 请升级后请重新进入。";
    var strCLodopInstall_1 = "打印控件CLodop未安装启动，请先下载并执行安装";
    var strCLodopInstall_3 = "，完成后请刷新或重启浏览器。";
    var LODOP;
    try {
        var ua = navigator.userAgent;
        var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) { }
            if (!LODOP && CLodopJsState !== "complete") {
                if (CLodopJsState == "loading")
                    showWarn("网页还没加载完毕，请稍等一下再操作");
                else
                    showWarn("没有加载CLodop的主js，请先调用loadCLodop过程");
                return false;
            }
            if (!LODOP) {
                showConfirm(strCLodopInstall_1 + strCLodopInstall_3)
                return false;
            } else {
                if (CLODOP.CVERSION < "4.1.4.2") {
                    // showConfirm(strHtmUpdate)
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED); //清理旧版无效元素
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT);
            }
        } else {
            // var is64IE = isIE && !!(ua.match(/x64/i));
            //==如果页面有Lodop就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (isIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            } else if (!CreatedOKLodopObject) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE)
                    LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else
                    LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodopObject = LODOP;
            }

            //  LODOP = CreatedOKLodopObject;
            // //==Lodop插件未安装时提示下载地址:==
            // if ((!LODOP) || (!LODOP.VERSION)) {
            //     if (ua.indexOf('Chrome') >= 0)
            //         document.body.innerHTML = strHtmChrome;
            //     if (ua.indexOf('Firefox') >= 0)
            //         document.body.innerHTML = strHtmFireFox;
            //     showError(strHtmInstall)
            //     return LODOP;
            // }

        }
        if (LODOP.VERSION < "6.2.2.6" && !needCLodop()) {
            // showError(strHtmUpdate);
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
        LODOP.SET_LICENSES("", "13528A153BAEE3A0254B9507DCDE2839", "EDE92F75B6A3D917F65910", "D60BC84D7CF2DE18156A6F88987304CB6D8");

        //===============================================.com//.com台级//.net
        return LODOP;
    } catch (err) {
        showError("getLodop出错:" + err);
    }
}

function showWarn (message) {
    Message.warning(message, 1.5)
}

function showError (error) {
    // Message.error(error, 1.5)
    Modal.error({
        title: '打印控件调用错误',
        content: error,
    });
}


function showConfirm (message) {
    Modal.confirm({
        title: "友情提示",
        content: message,
        okText: "前往下载",
        onOk: function () {
            // window.open("http://www.lodop.net/download.html")
            window.open("http://www.kdniao.com/documents-instrument")
        }
    })
}

export { getLodop }
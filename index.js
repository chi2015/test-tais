var pathArr = [
    {"path":"3:classes/0:A","value":"9"},
    {"path":"0:airports/0:SVO/0:A","value":"Moscow - arrival"},
    {"path":"2:cities/3:Paris","value":"France"},
    {"path":"3:classes/2:C","value":"6"},
    {"path":"3:classes/3:D","value":"1"},
    {"path":"0:airports/2:ECN","value":"Ercan"},
    {"path":"0:airports/0:SVO/3:D","value":"Moscow - local"},
    {"path":"3:classes/4:E","value":"0"},
    {"path":"0:airports/3:CDG","value":"Charles-de-Gaulle"},
    {"path":"0:airports/1:LTN","value":"London"},
    {"path":"3:classes/1:B","value":"8"},
    {"path":"2:cities/0:Moscow","value":"Russia"},
    {"path":"0:airports/0:SVO/1:B","value":"Moscow - international"},
    {"path":"2:cities/1:London","value":"Great Britain"}
];

function generateTreeObj(paths) {
    var treeObj = {};
    treeObj.name = 'root';
    treeObj.children = [];
    var currentDepth;
    paths.forEach(function(path) {
        currentDepth = treeObj.children;
        var pathSplit = path.path.split("/");
        pathSplit.forEach(function(depth,i) {
            var depthArr = depth.split(":")
            index = +depthArr[0];
            var name = depthArr[1];
            if (!currentDepth[index]) currentDepth[index] = {
                name : name
            };

            if (i != pathSplit.length - 1) {
                if (!currentDepth[index].children) currentDepth[index].children = [];
                currentDepth = currentDepth[index].children;
            }
            else currentDepth[index].value = path.value;
        });
        
    });
    
    return treeObj;
}

function generateHTMLTree(obj, pathTo, index) {
    var ret = '';
    var newEl = document.createElement('div');
    newEl.innerHTML = obj.name;
    var newPath =  pathTo !== ''? pathTo + '-' + index+':'+obj.name : obj.name;
    ret += newEl.outerHTML;
    if (obj.value) {
        newEl = document.createElement('div');
        newEl.id = newPath;
        newEl.innerHTML = obj.value;
        var onClickFunc = "showPath('"+newPath+"');";
		newEl.setAttribute('onclick', onClickFunc);
        ret += newEl.outerHTML;
    }
    else if (Array.isArray(obj.children)) {
        var newUl = document.createElement('ul')
        obj.children.forEach(function(child, index) {
            var newLi = document.createElement('li');
            newLi.innerHTML = generateHTMLTree(child, newPath, index);
            newUl.appendChild(newLi);
        });
        ret += newUl.outerHTML;
    }

    return ret;
}

function showPath(id) {
    document.getElementById('current-path').innerHTML = id.split("-").splice(1).join("/");
    var elDiv = document.getElementById(id);
    elDiv.style.display = 'none';
    var elInput = document.createElement('input');
    elInput.value = elDiv.innerHTML;
    elInput.id = 'input-'+elDiv.id;
    var onBlurFunc = "inputBlur('"+id+"');";
    elInput.setAttribute('onblur', onBlurFunc);
    elDiv.parentElement.appendChild(elInput);
    
    elInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          elInput.blur();
        }
      });
    document.getElementById(elInput.id).focus();
    
}

function inputBlur(id) {
    var elInput = document.getElementById('input-'+id);
    var elDiv = document.getElementById(id);
    var newValue = elInput.value;
    elDiv.innerHTML = elInput.value;
    elInput.parentElement.removeChild(elInput);
    elDiv.style.display = 'block';
    changeObjValue(id, newValue);
}

function changeObjValue(id, value) {
  var namesArr = id.split('-'); 
  var currentObj = treeObj;
  namesArr.forEach(function(item, index) {
    if (index === 0) return;
    var pair = item.split(':');
    currentObj = currentObj['children'][+pair[0]];
  });
  currentObj.value = value;
}

var treeObj = generateTreeObj(pathArr);
document.getElementById('main').innerHTML = generateHTMLTree(treeObj, '');
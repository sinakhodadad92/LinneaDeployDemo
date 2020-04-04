

var examples = {
  
  input1: {
    name: "Least Squares",
    expr: "\\(b = (X^TX)^{-1}X^Ty\\)",
    code: "b = inv(trans(X)*X)*trans(X)*y",
  },
  input2:{
    name: "Generalized Least Squares",
    expr: "\\(z = (X^TS^{-1}X)^{-1}X^TS^{-1}y\\)",
    code: "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y",
  }
  // input3:{
  //   name: "Triangular Matrix Inversion",
  //   expr: "X10 = L10 * inv(L00) ...",
  //   code: "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1",
  // },
  // input4:{
  //   name: "Image Restoration",
  //   expr: "H_dag = trans(H) * ... \n ",
  //   code: "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)",
  // },
  // input5:{
  //   name: "Stochastic Newton",
  //   expr: "Bout = k * inv * ...",
  //   code: "Bout = ((k*inv(kminus1))*Bin*(In+(minus1*trans(A)*wk*(inv((kminus1*I1)+(trans(wk)*A*Bin*trans(A)*wk))*trans(wk)*A*Bin",
  // }
  
};

var listExamplesBody = "";
for (var e in examples) {
  listExamplesBody += "<li id=\"example_";
  listExamplesBody += e;
  listExamplesBody += "\" class=\"mdl-menu__item\">";
  listExamplesBody += examples[e].name;
  listExamplesBody += ":&nbsp;  ";
  listExamplesBody += examples[e].expr;
  listExamplesBody += "</li>";
}
$("#listExamples").html(listExamplesBody);

for (var e in examples) {
  (function(code, formats) {
    var setExample = function() {
      $("#txtExpr").val(code);
      $("#txtExpr").html(code);

      $("#lblError").css('visibility', 'hidden');

      model.setInput(code);
    };
    $("#example_" + e).click(setExample);
    $("#lblError").css('visibility', 'hidden');
    
  })(examples[e].code, examples[e].formats);
}


  $("#txtExpr").keyup(function() {
    model.setInput($("#txtExpr").val());
    $("#lblError").css('visibility', 'hidden');

  });

  function out(blah){
    console.log(blah);
  }

  // function ifVarExists(StrObj, VarObj){
  //   var str = StrObj;
  //   parts = str.split('=');
  //   var i=0;
  //   if(parts[0].includes(VarObj) || parts[2].includes(VarObj) || parts[4].includes(VarObj) || parts[6].includes(VarObj)){
  //     if(parts[1].includes(VarObj) || parts[3].includes(VarObj) || parts[5].includes(VarObj) || parts[7].includes(VarObj)){
  //       return true;
  //     }else{
  //       return false;
  //     }
  //   }
  // }

  function getVarNamesFromString(StrObj) {
    var separateNamesBy = ", ";
    var name = "<none>"; // if no match, use this
    var namesArray = StrObj.match(/[a-zA-Z_][a-zA-Z0-9_]*/gi);
    var scannedarray = [];
    var ban_inv = "inv";
    var ban_trans = "trans";
    if (namesArray) {
        name = "";
        for (var i = 0; i < namesArray.length; i++) {
            //out(ifVarExists(StrObj,namesArray[i]));
            if (i != 0) name += separateNamesBy;
            if(((namesArray[i] == ban_inv) || (namesArray[i] == ban_trans)) || (scannedarray.includes(namesArray[i])))continue;
            name += namesArray[i];
            scannedarray.push(namesArray[i]);
        }
    }
    return name;
  }

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  var currentVariableId = 0;
  var model = {
    input: {
      expression: "",
      juliaVars:{},

      Matrices:{
        Name:"",
        Columns:"",
        Rows:"",
        Properties:[],
      },
      Vectors:{
        Name:"",
        size:"",
      },
      error: "",
    },
    output: {
      fullCode: "",
      error: ""
    },
    req: null,

    inputViews: [],
    outputViews: [],
    reqViews: [],

    mat_IDs: [],
    vec_IDs: [],
    all_IDs: [],
    mat_GEN: [],
    vec_GEN: [],
    all_IDs_GEN: [],

    addInputView: function(newView) {
      model.inputViews.push(newView);
      newView(400);
    },
    updateInputViews: function() {
      for (v in model.inputViews) {
        model.inputViews[v](400);
      }
    },
    addOutputView: function(newView) {
      model.outputViews.push(newView);
      newView(0);
    },
    updateOutputViews: function() {
      for (v in model.outputViews) {
        model.outputViews[v](0);
      }
    },
    addReqView: function(newView) {
      model.reqViews.push(newView);
      newView(0);
    },
    updateReqViews: function() {
      for (v in model.reqViews) {
        model.reqViews[v](0);
      }
    },

    setInput: function(expression) {
      var inputExpr;
      var temp_1;
      var temp_2 = [];
      model.cancelReq();
      model.setOutput("", "");

      model.input.expression = expression;
      if (model.input.expression.length > 256) {
        model.input.juliaVars = {};
        model.input.error = "Input expression is too long";
      } else {
        inputExpr = getVarNamesFromString(expression);
        inputExpr = inputExpr.replace(/\s/g, '');

        if(inputExpr.includes(',')){
          temp_1 = inputExpr.split(',');
          var temp1 = temp_1.filter(function (el) {
            return el != "";
          })
          model.input.juliaVars = temp1;
        }else{
          temp_2.push(inputExpr);
          var temp2 = temp_2.filter(function (el) {
            return el != "";
          })
          model.input.juliaVars = [temp2];
        }
        model.input.error = "";

      }
      model.updateInputViews();
    },
    setOutput: function(fullCode, error) {
      model.output = { fullCode: fullCode, error: error };
      model.updateOutputViews();
    },
    setReq: function(req) {
      model.req = req;
      model.updateReqViews();
    },

    cancelReq: function() {
      if (model.req) {
        if (model.req.readyState !== 4) {
          model.req.abort();
        }
        model.setReq(null);
      }
    },
    getError: function() {
      return (model.output.error !== "") ? model.output.error : model.input.error;
    }
  };

  var txtExprView = {
  timerEvent: null,

  updateView: function(timeout) {
    clearTimeout(txtExprView.timerEvent);

    }
  };

  var tblFormatsView = {
    cache: {},
    addmoreIDs: [],
    timerEvent: null,

    updateView: function(timeout) {

      clearTimeout(tblFormatsView.timerEvent);
      if (model.getError() !== "") {
        var hideTable = function() { $("#tblFormats").hide(); };
        tblFormatsView.timerEvent = setTimeout(hideTable, timeout);
      } else {
        var listLinneaBody = "";
        model.input.test = [];
        model.mat_GEN = [];
        model.vec_GEN = [];
        model.all_IDs_GEN = [];
        for (j in model.input.juliaVars) {
          var variable = model.input.juliaVars[j];
          if(/^[A-Z]/.test(variable)){
            var matricecreator = [];
            model.input.test.push({id:j, name:variable});

            var M_TD_ID_1 = "M_TD_ID_1_J_" + j;
            var M_TD_1_DIV_1  = "M_TD_1_DIV_1_J_" + j;

            var M_TD_ID_2 = "M_TD_ID_2_J_" + j;

            var M_TD_2_UL_1 = "M_TD_2_UL_1_J_" + j;
            var M_TD_2_UL_LI_1 = "M_TD_2_UL_LI_1_J_" + j;

            var M_R_TD_2_UL_LI_2 = "M_R_TD_2_UL_LI_2_J_" + j;
            var M_R_TD_2_UL_LI_2_DIV_1 = "M_R_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_R_TD_2_UL_LI_2_DIV_INP_1 = "M_R_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_C_TD_2_UL_LI_2 = "M_C_TD_2_UL_LI_2_J_" + j;
            var M_C_TD_2_UL_LI_2_DIV_1 = "M_C_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_C_TD_2_UL_LI_2_DIV_INP_1 = "M_C_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_P_TD_2_UL_LI_2 = "M_P_TD_2_UL_LI_2_J_" + j;
            var M_P_TD_2_UL_LI_2_DIV_1 = "M_P_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_P_TD_2_UL_LI_2_DIV_INP_1 = "M_P_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_P_TD_2_UL_LI_2_DIV_B_1 = "M_P_TD_2_UL_LI_2_DIV_B_1_J_" + j;

            matricecreator.push(variable);
            matricecreator.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.mat_IDs.push(matricecreator);

            listLinneaBody += "<tr>";
            listLinneaBody += "<td id=\""
            listLinneaBody += M_TD_ID_1;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "width=\"100\"><div id=\"";
            listLinneaBody += M_TD_1_DIV_1;
            listLinneaBody += "\" align=\"center\" ";
            listLinneaBody += "style=\"font-size: 16px\">";
            listLinneaBody += variable;
            listLinneaBody += "</div></td>";

            listLinneaBody += "<td id=\"";
            listLinneaBody += M_TD_ID_2;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "style=\"padding: 0px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += M_TD_2_UL_1;
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += M_TD_2_UL_LI_1;
            listLinneaBody += "\" class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";



            listLinneaBody += "<li id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == "b = inv(trans(X)*X)*trans(X)*y" && variable == 'X'){
              listLinneaBody += "value=\"1500";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "X"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "S"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L00"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L22"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L21"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L10"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X21"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X10"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H_dag"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "I"){
              listLinneaBody += "value=\"5000";
            }else{
              listLinneaBody += "value=\"";
            }

            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Rows: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul></div></li>";

            listLinneaBody += "<li id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == "b = inv(trans(X)*X)*trans(X)*y" && variable == "X"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "X"){
              listLinneaBody += "value=\"500";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "S"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L00"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L22"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L21"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L10"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X21"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X10"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H_dag"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "I"){
              listLinneaBody += "value=\"5000";
            }else{
              listLinneaBody += "value=\"";
            }

            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Columns: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul></div></li>";


            listLinneaBody += "<li class=\"\">";
            listLinneaBody += "<div class=\"\">";
            listLinneaBody += "</div></li>";

            listLinneaBody += "<li id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"content mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input extrawide\" placeholder=\"Properties\"id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" name=\"property\" ";

            if (model.input.expression == "b = inv(trans(X)*X)*trans(X)*y" && variable == "X"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "X"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "S"){
              listLinneaBody += "value=\"SPD";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L00"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L11"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L22"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L21"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L10"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "L20"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X21"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X11"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X10"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == "X10 = L10*inv(L00)\nX20 = L20+(inv(L22)*L21*inv(L11)*L10)\nX11 = inv(L11)\nX21 = inv(L22)*L21*-1" && variable == "X20"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "H"){
              listLinneaBody += "value=\"";
            }else{
              listLinneaBody += "value=\"";
            }

            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\" style=\"font-size: 13px\"disabled/>";
            listLinneaBody += "<label class=\"mdl-textfield__label extrawide\" for=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul>"

            listLinneaBody += "<button onclick='addProperty(this," + j + ")' id=\"";
            //listLinneaBody += "<button onclick='addProperty(this)' id=\"";

            listLinneaBody += "addmore";
            listLinneaBody += "\" class=\"mdl-button mdl-js-button mdl-button--icon\"";
            listLinneaBody += "style=\"position: absolute; margin-left: 172px;\">";
            listLinneaBody += "<i class=\"material-icons\">add_circle_outline</i></button>";
            listLinneaBody += "</div>";
            listLinneaBody += "</li>";

          } else {
            var V_TD_ID_1 = "V_TD_ID_1_J_" + j;
            var V_TD_ID_2 = "V_TD_ID_2_J_" + j;
            var V_TD_UL_ID_1 = "V_TD_UL_ID_1_J_" + j;
            var V_TD_UL_LI_ID_1 = "V_TD_UL_LI_ID_1_J_" + j;
            var V_TD_UL_LI_ID_2 = "V_TD_UL_LI_ID_2_J_" + j;

            var V_TD_UL_LI_DIV_ID_1 = "V_TD_UL_LI_DIV_ID_1_J_" + j;

            var V_TD_UL_LI_DIV_INP_ID_1 = "V_TD_UL_LI_DIV_INP_ID_1_J_" + j;

            var vectorCreator = [];

            vectorCreator.push(variable);
            vectorCreator.push(V_TD_UL_LI_DIV_INP_ID_1);
            model.all_IDs.push(V_TD_UL_LI_DIV_INP_ID_1);
            vectorCreator.push(makeid(3));

            model.vec_IDs.push(vectorCreator);

            listLinneaBody += "<tr>";
            listLinneaBody += "<td id=\"";
            listLinneaBody += V_TD_ID_1;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "width=\"100\">"
            listLinneaBody += "<div align=\"center\" ";
            listLinneaBody += "style=\"font-size: 16px\">";
            listLinneaBody += variable;
            listLinneaBody += "</div></td>";

            listLinneaBody += "<td id=\"";
            listLinneaBody += V_TD_ID_2;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "style=\"padding: 0px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += V_TD_UL_ID_1;
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += V_TD_UL_LI_ID_1;
            listLinneaBody += "\ class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";

            listLinneaBody += "<li id=\"";
            listLinneaBody += V_TD_UL_LI_ID_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\""
            listLinneaBody += V_TD_UL_LI_DIV_ID_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == "b = inv(trans(X)*X)*trans(X)*y" && variable == "y"){
              listLinneaBody += "value=\"1500";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "z"){
              listLinneaBody += "value=\"500";
            }else if(model.input.expression == "z = inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y" && variable == "y"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == "b = inv(trans(X)*X)*trans(X)*y" && variable == "b"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "y_k"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "y"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == "H_dag = trans(H)*inv(H*trans(H))\ny_k = (H_dag*y)+(((I+(H*H_dag*-1))*x)" && variable == "x"){
              listLinneaBody += "value=\"5000";
            }else{
              listLinneaBody += "value=\"";
            }


            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "</label>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\">Size: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";
            listLinneaBody += "</ul></div></li>";
          }
          listLinneaBody += "</ul></td></tr>";
        }
        if (listLinneaBody !== "") {
          $("#listLinneas").html(listLinneaBody);
          getmdlSelect.init(".getmdl-select");
          model.mat_GEN = model.mat_IDs.slice();
          model.mat_IDs = [];
          model.vec_GEN = model.vec_IDs.slice();
          model.vec_IDs = [];

          model.all_IDs_GEN = model.all_IDs.slice();
          out(model.all_IDs_GEN);
          model.all_IDs = [];

          $("#tblFormats").show();
        } else {
          $("#tblFormats").hide();
        }
      }
    }
  };

  model.addInputView(txtExprView.updateView);
  model.addInputView(tblFormatsView.updateView);
  //model.addInputView(btnGetKernelView.updateView);



  model.addOutputView(txtExprView.updateView);
  //model.addOutputView(panelKernelsView.updateView);
  //model.addOutputView(btnDownloadView.updateView);


  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


  var favorite = [];
  var inputInto = "";
  function addProperty(object, id){
    currentVariableId = id;
    modal.style.display = "block";
    var thisID = $(object).attr('id');
    inputInto = $(object).closest("div.content").find("input").attr('id');
    out('this id is: ' + thisID);

    $('input:checkbox').removeAttr('checked');

    $.each($("input[name='properties']:checked"), function(){
      favorite.push($(this).val());
    });

    out(model.input.test[currentVariableId])



  }

  function saveProperty(request){
    $("input:checkbox[name='properties']:checked").each(function(){
     favorite.push($(this).val());
    });
    var properties = favorite.join(", ");
    $('#'+inputInto).val(properties);
    var parentID = $(this).closest('li').attr('id');
    modal.style.display = "none";
    inputInto = " ";
    favorite = [];
    out(favorite);
  }

  function clearProperty(request){


    var properties = "";

    $('#'+inputInto).val(properties);

    var parentID = $(this).closest('li').attr('id');

    // save your value where you want
    modal.style.display = "none";
    inputInto = " ";
    
  }


  function generateInput(){

    var inputGenerated = "";

    inputGenerated += "\n"
    out(model.mat_GEN);
    out(model.vec_GEN);

    if(model.mat_GEN  !== undefined && model.mat_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i < model.mat_GEN.length; i++){

        inputGenerated += model.mat_GEN[i][2];
        inputGenerated += " = ";
        inputGenerated += $('#'+model.mat_GEN[i][1]).val();
        inputGenerated += "\n";

        inputGenerated += model.mat_GEN[i][4];
        inputGenerated += " = ";
        inputGenerated += $('#'+model.mat_GEN[i][3]).val();
        inputGenerated += "\n";

      }
    }

    if(model.vec_GEN  !== undefined && model.vec_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i<model.vec_GEN.length; i++){
        inputGenerated += model.vec_GEN[i][2];
        inputGenerated += " = ";
        inputGenerated += $('#'+model.vec_GEN[i][1]).val();
        inputGenerated += "\n";

      }
    }


    if(model.mat_GEN  !== undefined && model.mat_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i< model.mat_GEN.length; i++){
        inputGenerated += "Matrix " + model.mat_GEN[i][0] + "(" + model.mat_GEN[i][2] + ", " + model.mat_GEN[i][4] + ")" + ' <' + $('#'+model.mat_GEN[i][5]).val() +">";
        inputGenerated += "\n";
      }
    }

    if(model.vec_GEN  !== undefined && model.vec_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i< model.vec_GEN.length; i++){
        inputGenerated += "ColumnVector " + model.vec_GEN[i][0] + "(" + model.vec_GEN[i][2] + ")<>";
        inputGenerated += "\n";
      }
    }
    inputGenerated += model.input.expression;

    out('inputGenerated is ' + inputGenerated);
    out("\n");
    out("hidden input value before assign: " + $("#description").val());
    $("#description").val(inputGenerated);
    out("hidden input value after assign: " + $("#description").val());


  }

  function downloadOutput(){
    out("in download!")
    var blob = new Blob([$('#txtComputeLoops').val()],
              {type: "text/plain;charset=utf-8"});
    saveAs(blob, "Linnea_Algorithm.la");
  }



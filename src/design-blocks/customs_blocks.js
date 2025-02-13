// Function to update the R code display
function updateRCode() {
    var rCodeDisplay = document.getElementById('rCodeDisplay');

    var blocks = workspace.getTopBlocks(true);
    var code = blocks.map(function(block) {
        return Blockly.JavaScript.blockToCode(block);
    }).join('\n');

    document.getElementById('rCodeDisplay').innerHTML = '<pre style="font-family: \'Courier New\', monospace; height: auto; overflow: auto;"><code>' + code + '</code></pre>';
    // document.getElementById('rCodeDisplay').innerHTML = '<p="font-family: "Courier New", monospace; background-color: #000000;">' + code + '</p>';

    rCodeDisplay.style.display = 'block';
}

function download() {
    // Get the generated R code.
    var rCode = Blockly.JavaScript.workspaceToCode(workspace);

    // Remove semicolons from the end of each line (if any).
    rCode = rCode.replace(/;\s*$/gm, ''); // Remove semicolon at the end of each line

    // Create a Blob containing the R code as text.
    var blob = new Blob([rCode], { type: 'text/plain' });

    // Create a temporary URL for the Blob.
    var url = URL.createObjectURL(blob);

    // Create an anchor element for the download link.
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'generated_R_code.R'; // Set the file name as you like

    // Trigger a click event on the anchor element to initiate the download.
    downloadLink.click();

    // Release the allocated resources.
    URL.revokeObjectURL(url);
}

Blockly.JavaScript['numeric_type'] = function (block) {
    return ("" + block.getFieldValue('NUM_VALUE'));
};

Blockly.JavaScript['string_type'] = function (block) {
    return ('"' + block.getFieldValue('STR_VALUE') + '"');
};

Blockly.JavaScript['list_type'] = function (block) {
    var list_string = "c("
    var inputBlock = block.getInputTargetBlock('LIST_VALUES');
    list_string += Blockly.JavaScript.blockToCode(inputBlock);
    if (list_string.length > 2){
        list_string = list_string.slice(0, -1);
    }
    list_string += ")";

    return list_string
};

Blockly.JavaScript['list_element_type'] = function (block) {
    var inputBlock = block.getInputTargetBlock('LIST_ELEMENT_VALUE');
    var code = Blockly.JavaScript.blockToCode(inputBlock);
    if (code === ""){
        return "";
    } else {
        return ("" + code + ",");
    }
};

Blockly.JavaScript['null_type'] = function (block) {
    return ("NULL");
};

Blockly.JavaScript['print_type'] = function (block) {
    var inputBlock = block.getInputTargetBlock('OUTPUT_VALUE');
    var code = Blockly.JavaScript.blockToCode(inputBlock);
    return ("print(" + code + ")\n");
};

Blockly.JavaScript['variable_creation_type'] = function (block) {
    var var_name = block.getFieldValue('VAR');
    var inputBlock = block.getInputTargetBlock('VAR_VALUE');
    if (inputBlock == null){
        return "";
    }
    var code = Blockly.JavaScript.blockToCode(inputBlock);

    if (var_name === ""){
        var_name = "sample_variable1";
    }

    return (var_name + " <- " + code + "\n");
}

Blockly.JavaScript['variable_usage_type'] = function (block) {
    return ("" + block.getFieldValue('OLD_VAR'));
}

Blockly.JavaScript['aggregate_type'] = function (block) {
    var agg_type = block.getFieldValue('AGGREGATE_TYPE');
    var inputBlock = block.getInputTargetBlock('AGG_VALUE');
    if (inputBlock == null){
        return "";
    }
    var list_code = Blockly.JavaScript.blockToCode(inputBlock);
    
    if (agg_type === "MEAN"){
        return "mean(" + list_code + ")";
    } else if (agg_type === "MEDIAN"){
        return "median(" + list_code + ")";
    } else if (agg_type === "MODE"){
        return 'as.numeric(names(table(' + list_code + ')[table(' + list_code + ') == max(table(' + list_code + '))]))';
    } else {
        return "max(" + list_code + ") - min(" + list_code + ")";
    }
}
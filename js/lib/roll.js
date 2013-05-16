

function getPrecedence(op) {
	if("*/".indexOf(op) != -1) return 2;
	if("-+".indexOf(op) != -1) return 1;
}

//allowed operators
function isOperator(op) {
	return "+-/*".indexOf(op) != -1;
}

//valid operands
function isOperand(op) {
	return !/[^0-9d]/.test(op);
}

function operateOn(op, left, right) {
	return eval(left+op+right);
}

//turn an equation into a postfix expression
//does not support parenthesis
function toPostfix(equation) {

	var stack = new Array()
	var retExpression = '';

	var tokens = getTokens(equation);

	tokens.forEach(function(token) {

		if(isOperand(token)) {

			//operand conversion from die to numeric
			if(token.indexOf('d') != -1) 
				token = roll(token);

			retExpression += token + " ";

		} else if(isOperator(token)){

			while(stack.length > 0) {
				var op = stack.pop();

				if(getPrecedence(op) >= getPrecedence(token))
					retExpression += op + " ";

				else {
					stack.push(op);
					break;
				}
			}

			stack.push(token);
		}
	});

	while(stack.length > 0) {
		var op = stack.pop();
		retExpression += op + " ";
	}

	return retExpression.trim();
}


//split the equation into tokens
function getTokens(equation) {

	//don't want to deal with spaces
	equation = equation.split(" ").join("");

	var buffer = '';
	var tokens = new Array();

	equation.split('').forEach(function(ch) {
		if(isOperand(ch)) {
			buffer += ch;
		} else if(isOperator(ch)) {
			tokens.push(buffer);
			tokens.push(ch);
			buffer = '';
		}
	});

	if(buffer != '') tokens.push(buffer);

	return tokens;
}

function evalPostfix(postfix) {
	var numberStack = new Array();

	var tokens = postfix.split(" ");

	tokens.forEach(function(token) {

		if(isOperand(token)) {
			numberStack.push(token);

		} else if(isOperator(token)){
			var right = numberStack.pop();
			var left = numberStack.pop();
			numberStack.push(operateOn(token, left, right));
		}
	});

	return numberStack.pop();
}

function evalExpression(expression) {
	var postfix = toPostfix(expression);
	return evalPostfix(postfix);
}

function rollExpression(expression) {
	return evalExpression(expression);
}

//roll a die
function roll(string) {
	var xdy = string.split("d");
	var x = parseInt(xdy[0]);
	var y = parseInt(xdy[1]);
	if(x <= 0 || y <= 0) return 0;
	return Math.floor(Math.random()*(((x*y)-x)+1))+x;
}
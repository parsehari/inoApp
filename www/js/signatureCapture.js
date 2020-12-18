function SignatureCapture( canvasID ) {
    this.touchSupported = Modernizr.touch;
    this.canvasID = canvasID;
    this.canvas = $("#"+canvasID);
    this.context = this.canvas.get(0).getContext("2d");
    
    var oCanvas = document.getElementById(canvasID);
    
    var iWidth = oCanvas.width + 10;
    var iHeight = oCanvas.height;
    
    var fillWidth = this.canvas.parent().innerWidth();
    var fillHeight = this.canvas.parent().innerHeight();
    
    this.context.lineWidth = 1;
    this.lastMousePoint = {x:0, y:0};
    
    this.canvas[0].width = this.canvas.parent().innerWidth();
    this.canvas[0].height = this.canvas.parent().innerHeight();
    
    if (this.touchSupported) {
        this.mouseDownEvent = "touchstart";
        this.mouseMoveEvent = "touchmove";
        this.mouseUpEvent = "touchend";
    }
    else {
        this.mouseDownEvent = "mousedown";
        this.mouseMoveEvent = "mousemove";
        this.mouseUpEvent = "mouseup";
    }
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0, 0, fillWidth, fillHeight);
    this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
}

SignatureCapture.prototype.onCanvasMouseDown = function () {
    var self = this;
    return function(event) {
        event.preventDefault(); // Added by Manish for preventing scroll while sign on signature pad
        self.mouseMoveHandler = self.onCanvasMouseMove()
        self.mouseUpHandler = self.onCanvasMouseUp()
        
        $(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
        $(document).bind( self.mouseUpEvent, self.mouseUpHandler );
        
        self.updateMousePosition( event );
        self.updateCanvas( event );
    }
}

SignatureCapture.prototype.onCanvasMouseMove = function () {
    var self = this;
    return function(event) {
        event.preventDefault(); // Added by Manish for preventing scroll while sign on signature pad
        self.updateCanvas( event );
        //event.preventDefault(); //Commented by Manish
        return false;
    }
}

SignatureCapture.prototype.onCanvasMouseUp = function (event) {
    var self = this;
    return function(event) {
        
        $(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
        $(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
        
        self.mouseMoveHandler = null;
        self.mouseUpHandler = null;
    }
}

SignatureCapture.prototype.updateMousePosition = function (event) {
    var target;
    if (this.touchSupported) {
        target = event.originalEvent.touches[0]
    }
    else {
        target = event;
    }
    
    var offset = this.canvas.offset();
    this.lastMousePoint.x = target.pageX - offset.left;
    this.lastMousePoint.y = target.pageY - offset.top;
    
}

SignatureCapture.prototype.updateCanvas = function (event) {
    
    this.context.beginPath();
    this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
    this.updateMousePosition( event );
    this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
    this.context.strokeStyle = "blue";
    this.context.stroke();
    
    
}

SignatureCapture.prototype.toString = function () {
    
    var dataString = this.canvas.get(0).toDataURL("image/jpeg",0.1);
    var index = dataString.indexOf( "," )+1;
    dataString = dataString.substring( index );
    
    return dataString;
}

SignatureCapture.prototype.clear = function () {
    
    var c = this.canvas[0];
    this.context.clearRect( 0, 0, c.width, c.height );
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0, 0, c.width, c.height);
}

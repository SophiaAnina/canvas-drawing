import React, { useRef, useState, useEffect } from 'react';
import { ImageDown,PaintBucket,Palette,Eraser } from 'lucide-react';
import { SketchPicker } from 'react-color';

const CanvasDrawing = () => {
  const canvasRef = useRef(null); // Reference to the canvas
  const contextRef = useRef(null); // Reference to the canvas context
  const [isDrawing, setIsDrawing] = useState(false); // Flag to track drawing status
  const [strokeColor, setStrokeColor] = useState('black'); // Current stroke color
  const [selectedColor, setSelectedColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('white'); // New background color state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPickerBackground, setShowColorPickerBackground] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
 
 // Inside your CanvasDrawing component

// Initialize canvas context only once on mount
useEffect(() => {
  const canvas = canvasRef.current;
  canvas.width = window.innerWidth * 0.4; 
  canvas.height = window.innerHeight * 0.79; 
  canvas.style.border = '4px solid black';
  canvas.style.borderRadius = '20px';


  
  // Set up the context
  const context = canvas.getContext('2d');
  context.lineCap = 'round';
  context.lineWidth = 5;
  context.strokeStyle = strokeColor; // Initial stroke color
  context.fillStyle = backgroundColor; // Set initial background color
  context.fillRect(0, 0, canvas.width, canvas.height); // Fill with background color
  contextRef.current = context;
}, [backgroundColor]); // Re-run effect when backgroundColor changes]); // Empty dependency array to run only on mount

// Update the color without reinitializing the canvas
const changeStrokeColor = (color) => {
  setStrokeColor(color.hex);
  setSelectedColor(color.hex);
  if (contextRef.current) {
      contextRef.current.strokeStyle = color.hex;
  }
};


const changeBackgroundColor = (color) => {
  setBackgroundColor(color.hex);
  setBackgroundColor(color.hex);
  const canvas = canvasRef.current;
  const context = contextRef.current;
  context.fillStyle = color.hex;
  context.fillRect(0, 0, canvas.width, canvas.height); // Update canvas background color
};
  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  // Update the line width in the context
useEffect(() => {
  if (contextRef.current) {
    contextRef.current.lineWidth = lineWidth;
  }
}, [lineWidth]);

  // Draw on the canvas
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Save the canvas as an image
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'drawing.png';
    link.click();
  };
  // Add a button to display the drawing
const displayDrawing = () => {
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL();
  const image = document.createElement('img');
  image.src = dataURL;
  document.body.appendChild(image);
};
const ImageDownstyle = {
  height: 60,
  width: 60,
  color: 'black',
}

const PaintBucketstyle = {
  height: 60,
  width: 60,
  color: 'black',
}
  return (
    <div className='canvas'>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className='tools'>
        <PaintBucket 
        style={PaintBucketstyle} 
        onClick={() => setShowColorPickerBackground(!showColorPickerBackground)}
         />
        <SketchPicker 
           className={`color-picker-background ${showColorPickerBackground ? 'show' : ''}`}
           color={strokeColor}
           onChangeComplete={changeBackgroundColor}
         />
        
        <Palette 
        style={PaintBucketstyle} 
        className='palette' 
        onClick={() => setShowColorPicker(!showColorPicker)} />
        
        <SketchPicker 
           className={`color-picker ${showColorPicker ? 'show' : ''}`}
           color={strokeColor}
           onChangeComplete={changeStrokeColor}
         />
         <ImageDown 
        style={ImageDownstyle} 
        onClick={(event) => { event.preventDefault();saveDrawing();}} />
         <button className='post-btn' onClick={displayDrawing}>Post</button>
         
          <button className='post-btn' onClick={clearCanvas}>Clear</button>
          <input
          type="range"
          min="1"
          max="50"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.valueAsNumber)}
          />
          <label>Line Width: {lineWidth}</label>
      </div>
     
    </div>
  );
};

export default CanvasDrawing;

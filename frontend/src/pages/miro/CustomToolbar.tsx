import {
	useEditor,
  } from '@tldraw/tldraw'
  import { Link } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import { api, YtIssue } from '../../shared/api/api';
  import { useAuth } from '../../app/providers/AuthProvider';
  import { PDFDocument } from 'pdf-lib';
  
  export function CustomToolbar() {
	const editor = useEditor();
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);
	const [isPresenting, setIsPresenting] = useState(false);
	const [tasks, setTasks] = useState<YtIssue[]>([]);
	const { accessToken } = useAuth();
  
	useEffect(() => {
	  if (isTaskModalOpen && accessToken) {
		api.ytTracker.issues.list(accessToken).then(setTasks);
	  }
	}, [isTaskModalOpen, accessToken]);
  
	const handleLinkToTask = () => {
	  if (editor.getSelectedShapes().length > 0) {
		setIsTaskModalOpen(true);
	  } else {
		alert('Please select a shape to link.');
	  }
	};
  
	const handleSelectTask = (taskId: string) => {
	  const selectedShapes = editor.getSelectedShapes();
	  if (selectedShapes.length > 0) {
		const shape = selectedShapes[0];
		editor.updateShape({
		  id: shape.id,
		  type: shape.type,
		  props: {
			...shape.props,
			linkedIssueId: taskId,
		  },
		});
	  }
	  setIsTaskModalOpen(false);
	};
  
	const handleLock = () => {
	  const selectedShapes = editor.getSelectedShapes();
	  if (selectedShapes.length > 0) {
		const shape = selectedShapes[0];
		editor.updateShape({
		  id: shape.id,
		  type: shape.type,
		  isLocked: !shape.isLocked,
		});
	  }
	};
  
	const handleExport = async (format: 'png' | 'pdf' | 'svg' | 'json') => {
	  const shapeIds = editor.getSelectedShapes().map((shape) => shape.id);
	  
	  switch (format) {
		case 'png': {
		  const blob = await editor.getSvgAsPng(shapeIds)
		  const link = document.createElement('a')
		  link.href = URL.createObjectURL(blob)
		  link.download = 'miro-export.png'
		  link.click()
		  break;
		}
		case 'svg': {
			const svg = await editor.getSvg(shapeIds)
			const link = document.createElement('a')
			const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
			link.href = URL.createObjectURL(blob)
			link.download = 'miro-export.svg'
			link.click()
			break;
		}
		case 'json': {
			const json = editor.store.getAsJson()
			const link = document.createElement('a')
			const blob = new Blob([json], { type: 'application/json' })
			link.href = URL.createObjectURL(blob)
			link.download = 'miro-export.json'
			link.click()
			break;
		}
		case 'pdf': {
			const svg = await editor.getSvg(shapeIds);
			const pdfDoc = await PDFDocument.create();
			const page = pdfDoc.addPage();
			const { width, height } = page.getSize();
			const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
			const svgDataUrl = await new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(svgBlob);
			});
			
			const pngImageBytes = await fetch(svgDataUrl).then((res) => res.arrayBuffer());
			const pngImage = await pdfDoc.embedPng(pngImageBytes);
			
			page.drawImage(pngImage, {
				x: 0,
				y: 0,
				width: width,
				height: height,
			});

			const pdfBytes = await pdfDoc.save();
			const blob = new Blob([pdfBytes], { type: 'application/pdf' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'miro-export.pdf';
			link.click();
			break;
		}
	  }
	  setIsExportModalOpen(false)
	};

	const handlePresent = () => {
		setIsPresenting(!isPresenting);
		editor.updateInstanceState({ isReadonly: !isPresenting });
	}
  
	return (
	  <>
		<div style={{
		  position: 'absolute',
		  top: 0,
		  left: 0,
		  width: '100%',
		  zIndex: 999,
		  display: isPresenting ? 'none' : 'flex',
		  justifyContent: 'center',
		}}>
		  <div style={{
			display: 'flex',
			gap: '4px',
			background: 'rgba(255, 255, 255, 0.9)',
			padding: '8px',
			borderRadius: '8px',
			margin: '8px',
			boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
		  }}>
			<Link className="btn btn--ghost" to="/miro" style={{ textDecoration: 'none', padding: '8px', marginRight: '8px' }}>← Back</Link>
			<div style={{ borderLeft: '1px solid #ccc', height: '24px', alignSelf: 'center' }}></div>
  
			<div style={{ borderLeft: '1px solid #ccc', height: '24px', alignSelf: 'center', marginLeft: '8px' }}></div>
			<button
			  onClick={handleLinkToTask}
			  title="Link to task"
			  style={{
				background: 'none',
				border: 'none',
				cursor: 'pointer',
				padding: '8px',
				borderRadius: '4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			  }}
			>
			  Link Task
			</button>
			<button
			  onClick={handleLock}
			  title="Lock/Unlock"
			  style={{
				background: 'none',
				border: 'none',
				cursor: 'pointer',
				padding: '8px',
				borderRadius: '4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			  }}
			>
			  Lock
			</button>
			<button
			  onClick={() => setIsExportModalOpen(true)}
			  title="Export"
			  style={{
				background: 'none',
				border: 'none',
				cursor: 'pointer',
				padding: '8px',
				borderRadius: '4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			  }}
			>
			  Export
			</button>
			<button
			  onClick={handlePresent}
			  title="Present"
			  style={{
				background: 'none',
				border: 'none',
				cursor: 'pointer',
				padding: '8px',
				borderRadius: '4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			  }}
			>
			  Present
			</button>
		  </div>
		</div>
		{isTaskModalOpen && (
		  <div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			zIndex: 1000,
			background: 'white',
			padding: '20px',
			borderRadius: '8px',
			boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
			width: '400px',
		  }}>
			<h2>Link to Task</h2>
			<div style={{ maxHeight: '300px', overflowY: 'auto' }}>
			  {tasks.map(task => (
				<div key={task.id} onClick={() => handleSelectTask(task.id)} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
				  {task.summary}
				</div>
			  ))}
			</div>
			<button onClick={() => setIsTaskModalOpen(false)} style={{ marginTop: '10px' }}>Close</button>
		  </div>
		)}
		{isExportModalOpen && (
		  <div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			zIndex: 1000,
			background: 'white',
			padding: '20px',
			borderRadius: '8px',
			boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
			width: '400px',
		  }}>
			<h2>Export Board</h2>
			<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
			  <button onClick={() => handleExport('png')}>PNG</button>
			  <button onClick={() => handleExport('pdf')}>PDF</button>
			  <button onClick={() => handleExport('svg')}>SVG</button>
			  <button onClick={() => handleExport('json')}>JSON</button>
			</div>
			<button onClick={() => setIsExportModalOpen(false)} style={{ marginTop: '10px' }}>Close</button>
		  </div>
		)}
	  </>
	)
  }


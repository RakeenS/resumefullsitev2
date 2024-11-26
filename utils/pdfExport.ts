import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPdf = async (elementId: string, fileName: string = 'resume.pdf') => {
  try {
    console.log('Attempting to find element with ID:', elementId);
    // Find the element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Element found, starting PDF export for element:', elementId);

    // Get the computed style of the element
    const style = window.getComputedStyle(element);
    const width = parseFloat(style.width);
    const height = parseFloat(style.height);

    console.log('Element dimensions:', { width, height });

    // Create canvas with better quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: width,
      windowHeight: height,
    });

    console.log('Canvas created with dimensions:', {
      width: canvas.width,
      height: canvas.height
    });

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Calculate dimensions to fit A4 while maintaining aspect ratio
    let imgWidth = a4Width;
    let imgHeight = (canvas.height * a4Width) / canvas.width;

    // If height exceeds A4 height, scale down to fit
    if (imgHeight > a4Height) {
      imgHeight = a4Height;
      imgWidth = (canvas.width * a4Height) / canvas.height;
    }

    console.log('Calculated PDF dimensions:', {
      imgWidth,
      imgHeight,
      a4Width,
      a4Height
    });

    // Create PDF with proper orientation
    const orientation = imgHeight > imgWidth ? 'portrait' : 'landscape';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    // Calculate centering offsets
    const xOffset = orientation === 'portrait' ? (a4Width - imgWidth) / 2 : (a4Height - imgWidth) / 2;
    const yOffset = orientation === 'portrait' ? (a4Height - imgHeight) / 2 : (a4Width - imgHeight) / 2;

    console.log('Adding image to PDF at offsets:', { xOffset, yOffset });

    // Add image to PDF with high quality
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);

    console.log('Image added to PDF, saving file:', fileName);

    // Save the PDF
    pdf.save(fileName);
    console.log('PDF export completed successfully');
    return true;
  } catch (error) {
    console.error('Error in PDF export:', error);
    throw error;
  }
};

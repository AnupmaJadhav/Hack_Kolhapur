import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const courseId = fields.courseId[0];
      const file = files.file[0];
      
      if (!file || !courseId) {
        return res.status(400).json({ error: 'Missing file or course ID' });
      }

      // Create directory path for course
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'courses', courseId);
      
      // Ensure directory exists
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalFilename;
      const ext = path.extname(originalName);
      const fileName = `${path.basename(originalName, ext)}-${timestamp}${ext}`;
      
      // File path to save
      const savePath = path.join(uploadsDir, fileName);
      
      // Copy file from temp location to destination
      const data = await fs.promises.readFile(file.filepath);
      await fs.promises.writeFile(savePath, data);
      
      // Remove temp file
      await fs.promises.unlink(file.filepath);
      
      // Path to serve the file (relative URL)
      const filePath = `/uploads/courses/${courseId}/${fileName}`;
      
      // Return success response
      res.status(200).json({
        success: true,
        fileName: originalName,
        filePath: filePath
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}
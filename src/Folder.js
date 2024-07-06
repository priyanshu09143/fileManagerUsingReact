// src/folders.js
const folders = [
    {
      id: 1,
      name: 'Root',
      isFolder: true,
      contents: [
        {
          id: 2,
          name: 'Documents',
          isFolder: true,
          contents: [
            { id: 3, name: 'Resume.docx', isFolder: false },
            { id: 4, name: 'CoverLetter.docx', isFolder: false },
          ],
        },
        {
          id: 5,
          name: 'Images',
          isFolder: true,
          contents: [
            { id: 6, name: 'Vacation.png', isFolder: false },
            { id: 7, name: 'Family.png', isFolder: false },
          ],
        },
      ],
    },
  ];
  
  export default folders;
  
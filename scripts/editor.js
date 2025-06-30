// Resume Editor
const resumeEditor = {
    profilePictureUrl: '',

    init: function() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeEditor());
            } else {
                this.initializeEditor();
            }
        } catch (error) {
            console.error('Error initializing resume editor:', error);
            // Don't show alert on first load, only on subsequent errors
            if (document.readyState === 'complete') {
                alert('Failed to initialize the resume editor. Please refresh the page.');
            }
        }
    },

    initializeEditor: function() {
        // Initialize all handlers
        this.setupFormHandlers();
        this.setupPreviewHandlers();
        this.setupDownloadHandlers();
        this.setupProfilePicture();
        this.loadSavedData();
        this.setupAutoSave();
        this.setupCustomizationHandlers();
        this.updatePreview(); // Initial preview update

        console.log('Resume editor initialized successfully');
    },

    setupCustomizationHandlers: function() {
        // Color scheme handler
        const colorSchemeSelect = document.getElementById('colorScheme');
        if (colorSchemeSelect) {
            colorSchemeSelect.addEventListener('change', () => {
                this.updateColorScheme();
            });
        }

        // Font family handler
        const fontFamilySelect = document.getElementById('fontFamily');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', () => {
                this.updateFontFamily();
            });
        }
    },

    setupFormHandlers: function() {
        const form = document.getElementById('resumeForm');
        const addExperienceBtn = document.getElementById('addExperience');
        const addEducationBtn = document.getElementById('addEducation');

        if (!form || !addExperienceBtn || !addEducationBtn) {
            console.error('Required form elements not found');
            return;
        }

        // Form input handlers
        form.addEventListener('input', this.handleFormInput.bind(this));

        // Add experience button handler
        addExperienceBtn.addEventListener('click', () => {
            this.addExperienceField();
        });

        // Add education button handler
        addEducationBtn.addEventListener('click', () => {
            this.addEducationField();
        });

        // Form submit handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveResume();
        });
    },

    setupProfilePicture: function() {
        const profilePictureInput = document.getElementById('profilePicture');
        if (profilePictureInput) {
            profilePictureInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.profilePictureUrl = e.target.result;
                        this.updatePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    },





    setupPreviewHandlers: function() {
        const togglePreviewBtn = document.getElementById('togglePreview');
        const printPreviewBtn = document.getElementById('printPreview');
        const previewSection = document.querySelector('.preview-section');

        if (togglePreviewBtn) {
            togglePreviewBtn.addEventListener('click', () => {
                previewSection.classList.toggle('hidden');
                togglePreviewBtn.innerHTML = previewSection.classList.contains('hidden') 
                    ? '<i class="fas fa-eye"></i> Show Preview'
                    : '<i class="fas fa-eye-slash"></i> Hide Preview';
            });
        }

        if (printPreviewBtn) {
            printPreviewBtn.addEventListener('click', () => {
                window.print();
            });
        }
    },

    setupDownloadHandlers: function() {
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.showDownloadOptions();
            });
        }
    },

    showDownloadOptions: function() {
        const modal = document.createElement('div');
        modal.className = 'download-modal';
        modal.innerHTML = `
            <div class="download-options">
                <h3>Download Resume</h3>
                <div class="download-buttons">
                    <button class="btn-primary" onclick="resumeEditor.downloadResume('pdf')">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button class="btn-primary" onclick="resumeEditor.downloadResume('docx')">
                        <i class="fas fa-file-word"></i> DOCX
                    </button>
                    <button class="btn-primary" onclick="resumeEditor.downloadResume('jpg')">
                        <i class="fas fa-file-image"></i> JPG
                    </button>
                    <button class="btn-primary" onclick="resumeEditor.downloadResume('png')">
                        <i class="fas fa-file-image"></i> PNG
                    </button>
                </div>
                <button class="btn-secondary" onclick="this.closest('.download-modal').remove()">
                    Cancel
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    downloadResume: async function(format) {
        try {
            const downloadBtn = document.getElementById('downloadBtn');
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Generating...';
            downloadBtn.disabled = true;

            const previewContainer = document.querySelector('.preview-container');
            if (!previewContainer) {
                throw new Error('Preview container not found');
            }

            const formData = this.getFormData();
            const content = this.generateResumeHTML('professional-1', formData);
            previewContainer.innerHTML = content;

            switch (format) {
                case 'jpg':
                case 'png':
                    await this.downloadAsImage(format);
                    break;
                case 'pdf':
                    await this.downloadAsPDF();
                    break;
                case 'docx':
                    await this.downloadAsDOCX();
                    break;
                default:
                    throw new Error('Unsupported format');
            }

            document.querySelector('.download-modal').remove();
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert('Failed to download resume. Please try again.');
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.textContent = 'Download';
            downloadBtn.disabled = false;
        }
    },

    downloadAsImage: async function(format) {
        const previewContainer = document.querySelector('.preview-container');
        const canvas = await html2canvas(previewContainer, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `resume.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    },

    downloadAsPDF: async function() {
        try {
            const previewContainer = document.querySelector('.preview-container');
            if (!previewContainer) {
                throw new Error('Preview container not found');
            }

            // Set fixed dimensions for A4
            const a4Width = 210; // A4 width in mm
            const a4Height = 297; // A4 height in mm
            
            // Create a temporary container with A4 dimensions
            const tempContainer = document.createElement('div');
            tempContainer.style.width = `${a4Width}mm`;
            tempContainer.style.height = `${a4Height}mm`;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            tempContainer.style.background = 'white';
            tempContainer.style.padding = '20mm';
            tempContainer.innerHTML = previewContainer.innerHTML;
            document.body.appendChild(tempContainer);

            // Capture the content with proper scaling
            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: a4Width * 3.78, // Convert mm to pixels (1mm ≈ 3.78px)
                height: a4Height * 3.78
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Create PDF with A4 dimensions
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate scaling to fit content
            const imgWidth = a4Width;
            const imgHeight = (canvas.height * a4Width) / canvas.width;
            
            // If content is too tall, scale it down
            let finalWidth = imgWidth;
            let finalHeight = imgHeight;
            if (imgHeight > a4Height) {
                const scale = a4Height / imgHeight;
                finalWidth = imgWidth * scale;
                finalHeight = a4Height;
            }

            // Center the content on the page
            const xOffset = (a4Width - finalWidth) / 2;
            const yOffset = (a4Height - finalHeight) / 2;

            // Add the image to PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);

            // Save the PDF
            const formData = this.getFormData();
            const fileName = `${formData.fullName || 'resume'}-resume`.toLowerCase().replace(/\s+/g, '-');
            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    },

    downloadAsDOCX: async function() {
        const previewContainer = document.querySelector('.preview-container');
        const text = previewContainer.innerText;
        
        const { Document, Packer, Paragraph, TextRun } = window.docx;
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: text,
                                size: 24
                            })
                        ]
                    })
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        const link = document.createElement('a');
        link.download = 'resume.docx';
        link.href = URL.createObjectURL(blob);
        link.click();
    },

    getFormData: function() {
        const form = document.getElementById('resumeForm');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const baseKey = key.slice(0, -2);
                if (!data[baseKey]) {
                    data[baseKey] = [];
                }
                data[baseKey].push(value);
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    handleFormInput: function() {
        this.updatePreview();
        this.saveResume();
    },

    updatePreview: function() {
        const previewContainer = document.getElementById('resumePreview');
        if (!previewContainer) return;

        const formData = this.getFormData();
        const content = this.generateResumeHTML('professional-1', formData);
        previewContainer.innerHTML = content;
    },

    generateResumeHTML: function(template, data) {
        const colorScheme = document.getElementById('colorScheme').value;
        const fontFamily = document.getElementById('fontFamily').value;

        let html = `
            <div class="resume-preview ${colorScheme}" style="font-family: ${fontFamily}">
                <div class="resume-header">
                    <div class="profile-section">
                        ${this.profilePictureUrl ? `<img src="${this.profilePictureUrl}" alt="Profile" class="profile-picture">` : ''}
                        <h1>${data.fullName || 'Your Name'}</h1>
                        <p>${data.email || 'email@example.com'} | ${data.phone || 'Phone Number'}</p>
                        <p>${data.location || 'Location'}</p>
                    </div>
                </div>

                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${data.summary || 'Your professional summary goes here.'}</p>
                </div>

                <div class="resume-section">
                    <h2>Work Experience</h2>
                    ${this.generateExperienceHTML(data)}
                </div>

                <div class="resume-section">
                    <h2>Education</h2>
                    ${this.generateEducationHTML(data)}
                </div>

                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${this.generateSkillsHTML(data.skills)}
                    </div>
                </div>
            </div>
        `;

        return html;
    },

    generateExperienceHTML: function(data) {
        if (!data.company || !data.company.length) {
            return '<p>No work experience added yet.</p>';
        }

        return data.company.map((company, index) => `
            <div class="experience-item">
                <h3>${company}</h3>
                <div class="position">${data.position[index]}</div>
                <div class="date">${data.startDate[index]} - ${data.endDate[index] || 'Present'}</div>
                <p>${data.description[index]}</p>
            </div>
        `).join('');
    },

    generateEducationHTML: function(data) {
        if (!data.institution || !data.institution.length) {
            return '<p>No education added yet.</p>';
        }

        return data.institution.map((institution, index) => `
            <div class="education-item">
                <h3>${institution}</h3>
                <div class="position">${data.degree[index]}</div>
                <div class="date">${data.eduStartDate[index]} - ${data.eduEndDate[index] || 'Present'}</div>
                <p>${data.eduDescription[index]}</p>
            </div>
        `).join('');
    },

    generateSkillsHTML: function(skills) {
        if (!skills) return '';
        return skills.split(',').map(skill => `
            <span class="skill-tag">${skill.trim()}</span>
        `).join('');
    },

    addExperienceField: function() {
        const container = document.getElementById('workExperienceContainer');
        const newField = document.createElement('div');
        newField.className = 'experience-item';
        newField.innerHTML = `
            <div class="form-group">
                <label>Company Name</label>
                <input type="text" name="company[]" required>
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" name="position[]" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate[]" required>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="date" name="endDate[]">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description[]" rows="3" required></textarea>
            </div>
            <button type="button" class="remove-btn" onclick="this.closest('.experience-item').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newField);
    },

    addEducationField: function() {
        const container = document.getElementById('educationContainer');
        const newField = document.createElement('div');
        newField.className = 'education-item';
        newField.innerHTML = `
            <div class="form-group">
                <label>Institution</label>
                <input type="text" name="institution[]" required>
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" name="degree[]" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" name="eduStartDate[]" required>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="date" name="eduEndDate[]">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="eduDescription[]" rows="2"></textarea>
            </div>
            <button type="button" class="remove-btn" onclick="this.closest('.education-item').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newField);
    },

    updateColorScheme: function() {
        const preview = document.querySelector('.resume-preview');
        if (preview) {
            // Remove all existing color scheme classes
            preview.classList.remove('professional-1', 'professional-2', 'modern-1', 'modern-2', 'creative-1', 'creative-2');
            // Add the new color scheme class
            const colorScheme = document.getElementById('colorScheme').value;
            preview.classList.add(colorScheme);
        }
    },

    updateFontFamily: function() {
        const preview = document.querySelector('.resume-preview');
        if (preview) {
            const fontFamily = document.getElementById('fontFamily').value;
            preview.style.fontFamily = fontFamily;
        }
    },

    saveResume: function() {
        const formData = this.getFormData();
        localStorage.setItem('resumeData', JSON.stringify(formData));
    },

    loadSavedData: function() {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const form = document.getElementById('resumeForm');
            
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    data[key].forEach((value, index) => {
                        const inputs = form.querySelectorAll(`[name="${key}[]"]`);
                        if (inputs[index]) {
                            inputs[index].value = value;
                        }
                    });
                } else {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                }
            });
        }
    },

    setupAutoSave: function() {
        setInterval(() => {
            this.saveResume();
        }, 30000);
    }
};

// Initialize editor
resumeEditor.init();

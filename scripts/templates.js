// Template Management
const templateManager = {
    // Initialize template functionality
    init: function() {
        this.setupFilters();
        this.setupPreviewModal();
        this.setupTemplateSelection();
        this.checkUrlParameters();
        this.setupTemplateButtons();
    },

    // Setup template filtering
    setupFilters: function() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const templateCards = document.querySelectorAll('.template-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter templates
                const filter = button.dataset.filter;
                templateCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.6s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    },

    // Setup template preview modal
    setupPreviewModal: function() {
        const modal = document.querySelector('.preview-modal');
        const closeBtn = document.querySelector('.close-modal');
        const previewBtn = document.querySelector('.btn-preview');

        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },

    setupTemplateButtons: function() {
        const useTemplateBtn = document.querySelector('.btn-use-template');
        
        if (useTemplateBtn) {
            useTemplateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Store the selected template in localStorage
                localStorage.setItem('selectedTemplate', 'professional');
                // Redirect to create page
                window.location.href = 'create.html';
            });
        }
    },

    // Show template preview
    showTemplatePreview: function(templateId) {
        const previewContainer = document.querySelector('.template-preview-container');
        const useTemplateBtn = document.getElementById('useTemplateBtn');
        
        // Set template ID for the use button
        useTemplateBtn.dataset.template = templateId;

        // Create preview content based on template
        const previewContent = this.generatePreviewContent(templateId);
        previewContainer.innerHTML = previewContent;
    },

    // Generate preview content
    generatePreviewContent: function(templateId) {
        // Sample content for preview
        const sampleData = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            location: 'New York, NY',
            summary: 'Experienced professional with a proven track record in project management and team leadership.',
            company: ['Tech Corp', 'Innovation Labs'],
            position: ['Senior Project Manager', 'Team Lead'],
            startDate: ['2020-01', '2018-03'],
            endDate: ['Present', '2020-01'],
            description: [
                'Led cross-functional teams in successful project delivery',
                'Managed multiple high-priority projects simultaneously'
            ],
            institution: ['University of Technology'],
            degree: ['Bachelor of Science in Computer Science'],
            eduStartDate: ['2014-09'],
            eduEndDate: ['2018-05'],
            eduDescription: ['Graduated with honors'],
            skills: 'Project Management, Team Leadership, Agile, Scrum, Risk Management'
        };

        // Generate HTML based on template
        let html = '';
        switch (templateId) {
            case 'professional-1':
                html = this.generateProfessionalTemplate(sampleData);
                break;
            case 'professional-2':
                html = this.generateCorporateTemplate(sampleData);
                break;
            case 'modern-1':
                html = this.generateMinimalistTemplate(sampleData);
                break;
            case 'modern-2':
                html = this.generateContemporaryTemplate(sampleData);
                break;
            case 'creative-1':
                html = this.generateArtisticTemplate(sampleData);
                break;
            case 'creative-2':
                html = this.generateInnovativeTemplate(sampleData);
                break;
        }

        return html;
    },

    // Template generation functions
    generateProfessionalTemplate: function(data) {
        return `
            <div class="resume-preview professional-1">
                <div class="resume-header">
                    <h1>${data.fullName}</h1>
                    <div class="contact-info">
                        <p>${data.email} | ${data.phone}</p>
                        <p>${data.location}</p>
                    </div>
                </div>
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${data.summary}</p>
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
    },

    generateCorporateTemplate: function(data) {
        return `
            <div class="resume-preview professional-2">
                <div class="resume-header">
                    <div class="header-content">
                        <h1>${data.fullName}</h1>
                        <div class="contact-info">
                            <p>${data.email} | ${data.phone}</p>
                            <p>${data.location}</p>
                        </div>
                    </div>
                </div>
                <div class="resume-body">
                    <div class="resume-section">
                        <h2>Professional Summary</h2>
                        <p>${data.summary}</p>
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
            </div>
        `;
    },

    generateMinimalistTemplate: function(data) {
        return `
            <div class="resume-preview modern-1">
                <div class="resume-header">
                    <h1>${data.fullName}</h1>
                    <div class="contact-info">
                        <p>${data.email} | ${data.phone}</p>
                        <p>${data.location}</p>
                    </div>
                </div>
                <div class="resume-content">
                    <div class="resume-section">
                        <h2>Summary</h2>
                        <p>${data.summary}</p>
                    </div>
                    <div class="resume-section">
                        <h2>Experience</h2>
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
            </div>
        `;
    },

    generateContemporaryTemplate: function(data) {
        return `
            <div class="resume-preview modern-2">
                <div class="resume-header">
                    <div class="header-main">
                        <h1>${data.fullName}</h1>
                        <div class="contact-info">
                            <p>${data.email} | ${data.phone}</p>
                            <p>${data.location}</p>
                        </div>
                    </div>
                </div>
                <div class="resume-content">
                    <div class="resume-section">
                        <h2>About</h2>
                        <p>${data.summary}</p>
                    </div>
                    <div class="resume-section">
                        <h2>Experience</h2>
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
            </div>
        `;
    },

    generateArtisticTemplate: function(data) {
        return `
            <div class="resume-preview creative-1">
                <div class="resume-header">
                    <h1>${data.fullName}</h1>
                    <div class="contact-info">
                        <p>${data.email} | ${data.phone}</p>
                        <p>${data.location}</p>
                    </div>
                </div>
                <div class="resume-content">
                    <div class="resume-section">
                        <h2>About Me</h2>
                        <p>${data.summary}</p>
                    </div>
                    <div class="resume-section">
                        <h2>Experience</h2>
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
            </div>
        `;
    },

    generateInnovativeTemplate: function(data) {
        return `
            <div class="resume-preview creative-2">
                <div class="resume-header">
                    <div class="header-content">
                        <h1>${data.fullName}</h1>
                        <div class="contact-info">
                            <p>${data.email} | ${data.phone}</p>
                            <p>${data.location}</p>
                        </div>
                    </div>
                </div>
                <div class="resume-content">
                    <div class="resume-section">
                        <h2>Profile</h2>
                        <p>${data.summary}</p>
                    </div>
                    <div class="resume-section">
                        <h2>Experience</h2>
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
            </div>
        `;
    },

    // Helper functions for generating HTML
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

    // Check URL parameters for template selection
    checkUrlParameters: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        if (template) {
            // Store the selected template
            localStorage.setItem('selectedTemplate', template);
        }
    }
};

// Initialize template functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    templateManager.init();
}); 
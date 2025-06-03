// Global state
let documents = [];
let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let selectedAnswer = null;
let answers = [];
let showResult = false;

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file-btn');
const uploadTitle = document.getElementById('upload-title');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateCounts();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // File upload - Fixed the button connection
    chooseFileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => {
        if (!chooseFileBtn.disabled) {
            fileInput.click();
        }
    });

    // Quiz generation
    document.getElementById('document-select').addEventListener('change', handleDocumentSelect);
    document.getElementById('topic-select').addEventListener('change', updateGenerateButton);
    document.getElementById('generate-quiz-btn').addEventListener('click', handleGenerateQuiz);

    // Quiz playing
    document.getElementById('back-btn').addEventListener('click', () => switchView('generate'));
    document.getElementById('prev-btn').addEventListener('click', handlePrevious);
    document.getElementById('next-btn').addEventListener('click', handleNext);
    document.getElementById('show-answer-btn').addEventListener('click', handleShowAnswer);
    document.getElementById('restart-btn').addEventListener('click', handleRestartQuiz);
    document.getElementById('back-to-quizzes-btn').addEventListener('click', () => switchView('generate'));
}

function switchView(view) {
    // Update navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });

    // Update views
    document.querySelectorAll('.view').forEach(viewEl => {
        viewEl.classList.toggle('active', viewEl.id === `${view}-view`);
    });

    // Special handling for play view
    if (view === 'play') {
        updatePlayView();
    }
}

// File upload functionality
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragging');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        handleFileUpload(files[0]);
        // Reset the input so the same file can be selected again
        e.target.value = '';
    }
}

async function handleFileUpload(file) {
    console.log('Uploading file:', file.name);
    
    const isTextFile = file.type.includes('text') || file.name.endsWith('.txt');
    const isPDFFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isTextFile && !isPDFFile) {
        showToast('Invalid file type', 'Please upload a text file (.txt) or PDF file (.pdf)', 'error');
        return;
    }

    updateUploadState(true);
    
    try {
        let content;
        
        if (isPDFFile) {
            content = await extractTextFromPDF(file);
        } else {
            content = await file.text();
        }
        
        if (!content.trim()) {
            throw new Error('No readable text found in the document');
        }
        
        const topics = extractTopicsFromContent(content);
        
        const newDocument = {
            id: Date.now().toString(),
            name: file.name,
            content,
            uploadedAt: new Date().toISOString(),
            topics
        };

        documents.push(newDocument);
        updateDocumentsDisplay();
        updateDocumentSelect();
        updateCounts();
        
        showToast('Document uploaded successfully', `${file.name} has been processed and ${topics.length} topics were identified.`, 'success');
        console.log('Document uploaded:', newDocument);
    } catch (error) {
        console.error('Error processing file:', error);
        showToast('Upload failed', error.message || 'There was an error processing your document.', 'error');
    } finally {
        updateUploadState(false);
    }
}

async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

function extractTopicsFromContent(content) {
    const sentences = content.split(/[.!?]+/);
    const topics = new Set();
    
    sentences.forEach(sentence => {
        const words = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
        if (words) {
            words.forEach(word => {
                if (word.length > 3 && !['The', 'This', 'That', 'These', 'Those'].includes(word)) {
                    topics.add(word);
                }
            });
        }
    });

    return Array.from(topics).slice(0, 5);
}

function updateUploadState(isProcessing) {
    uploadTitle.textContent = isProcessing ? 'Processing document...' : 'Drop your document here';
    chooseFileBtn.textContent = isProcessing ? 'Processing...' : 'Choose File';
    chooseFileBtn.disabled = isProcessing;
}

function updateDocumentsDisplay() {
    const documentsCard = document.getElementById('documents-card');
    const documentsGrid = document.getElementById('documents-grid');
    
    if (documents.length === 0) {
        documentsCard.style.display = 'none';
        return;
    }
    
    documentsCard.style.display = 'block';
    documentsGrid.innerHTML = documents.map(doc => `
        <div class="document-item">
            <div class="document-header">
                <div class="document-title">
                    📄 ${doc.name}
                </div>
                <button class="btn btn-ghost" onclick="viewDocument('${doc.id}')">👁️</button>
            </div>
            
            <div class="topics">
                ${doc.topics.slice(0, 3).map(topic => `
                    <span class="topic-tag">${topic}</span>
                `).join('')}
                ${doc.topics.length > 3 ? `<span class="topic-tag">+${doc.topics.length - 3}</span>` : ''}
            </div>
            
            <div class="upload-date">
                Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

function updateDocumentSelect() {
    const select = document.getElementById('document-select');
    select.innerHTML = '<option value="">Choose a document</option>' +
        documents.map(doc => `<option value="${doc.id}">${doc.name}</option>`).join('');
}

function updateCounts() {
    document.getElementById('documents-count').textContent = documents.length;
    document.getElementById('quizzes-count').textContent = quizzes.length;
}

// Quiz generation - Fixed the logic
function handleDocumentSelect(e) {
    const documentId = e.target.value;
    const topicGroup = document.getElementById('topic-group');
    const topicSelect = document.getElementById('topic-select');
    
    console.log('Document selected:', documentId);
    
    if (documentId) {
        const document = documents.find(d => d.id === documentId);
        if (document) {
            console.log('Found document with topics:', document.topics);
            topicSelect.innerHTML = '<option value="">Choose a topic</option>' +
                document.topics.map(topic => `<option value="${topic}">${topic}</option>`).join('');
            topicGroup.style.display = 'block';
        }
    } else {
        topicGroup.style.display = 'none';
    }
    
    updateGenerateButton();
}

function updateGenerateButton() {
    const documentId = document.getElementById('document-select').value;
    const topic = document.getElementById('topic-select').value;
    const generateBtn = document.getElementById('generate-quiz-btn');
    
    console.log('Updating generate button - Doc:', documentId, 'Topic:', topic);
    generateBtn.disabled = !documentId || !topic;
}

document.getElementById('topic-select').addEventListener('change', updateGenerateButton);

async function handleGenerateQuiz() {
    const documentId = document.getElementById('document-select').value;
    const topic = document.getElementById('topic-select').value;
    
    console.log('Generating quiz for:', documentId, topic);
    
    if (!documentId || !topic) {
        showToast('Selection required', 'Please select a document and topic first.', 'error');
        return;
    }

    const document = documents.find(d => d.id === documentId);
    if (!document) {
        showToast('Document not found', 'The selected document was not found.', 'error');
        return;
    }

    const generateBtn = document.getElementById('generate-quiz-btn');
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '🔄 Generating Quiz...';
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const quiz = generateQuizQuestions(document, topic);
        quizzes.push(quiz);
        
        updateQuizzesDisplay();
        updateCounts();
        
        showToast('Quiz generated successfully', `Created a quiz with ${quiz.questions.length} questions about ${topic}.`, 'success');
        console.log('Quiz generated:', quiz);
    } catch (error) {
        console.error('Error generating quiz:', error);
        showToast('Generation failed', 'There was an error generating the quiz.', 'error');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🎯 Generate Quiz';
        updateGenerateButton(); // Re-check if button should be enabled
    }
}

function generateQuizQuestions(document, topic) {
    const sampleQuestions = [
        {
            id: '1',
            question: `What is the main concept related to ${topic} in the document?`,
            options: [
                `${topic} is a fundamental principle`,
                `${topic} is secondary to other concepts`,
                `${topic} is not mentioned`,
                `${topic} is outdated`
            ],
            correctAnswer: 0,
            explanation: `Based on the document content, ${topic} appears to be a key concept.`
        },
        {
            id: '2',
            question: `How does ${topic} relate to the document's main theme?`,
            options: [
                'It supports the main argument',
                'It contradicts the main theme',
                'It is unrelated',
                'It replaces the main theme'
            ],
            correctAnswer: 0,
            explanation: `The document presents ${topic} as supporting evidence for the main argument.`
        },
        {
            id: '3',
            question: `What would be a practical application of ${topic}?`,
            options: [
                'Academic research only',
                'Real-world implementation',
                'Historical reference',
                'Theoretical discussion'
            ],
            correctAnswer: 1,
            explanation: `${topic} has practical applications in real-world scenarios.`
        }
    ];

    return {
        id: Date.now().toString(),
        title: `${topic} Quiz`,
        topic,
        questions: sampleQuestions,
        documentId: document.id,
        createdAt: new Date().toISOString()
    };
}

function updateQuizzesDisplay() {
    const quizzesCard = document.getElementById('quizzes-card');
    const quizzesGrid = document.getElementById('quizzes-grid');
    
    if (quizzes.length === 0) {
        quizzesCard.style.display = 'none';
        return;
    }
    
    quizzesCard.style.display = 'block';
    quizzesGrid.innerHTML = quizzes.map(quiz => `
        <div class="quiz-item">
            <div class="quiz-header-item">
                <div class="quiz-title">${quiz.title}</div>
                <span class="topic-tag">${quiz.questions.length} questions</span>
            </div>
            
            <p style="opacity: 0.7; font-size: 0.875rem; margin-bottom: 1rem;">
                Topic: ${quiz.topic}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; opacity: 0.5;">
                    Created ${new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                <button class="btn btn-primary" onclick="playQuiz('${quiz.id}')">
                    ▶️ Play Quiz
                </button>
            </div>
        </div>
    `).join('');
}

// Quiz playing
function playQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;
    
    currentQuestionIndex = 0;
    selectedAnswer = null;
    answers = new Array(currentQuiz.questions.length).fill(null);
    showResult = false;
    
    switchView('play');
    updateQuizDisplay();
}

function updatePlayView() {
    const noQuizCard = document.getElementById('no-quiz-card');
    const quizElements = [
        'quiz-header', 'progress-container', 'question-card', 'quiz-controls'
    ];
    
    if (!currentQuiz) {
        noQuizCard.style.display = 'block';
        quizElements.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        document.getElementById('results-card').style.display = 'none';
        return;
    }
    
    noQuizCard.style.display = 'none';
    quizElements.forEach(id => {
        document.getElementById(id).style.display = 'flex';
    });
    document.getElementById('question-card').style.display = 'block';
    document.getElementById('results-card').style.display = 'none';
}

function updateQuizDisplay() {
    if (!currentQuiz) return;
    
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    
    // Update header
    document.getElementById('quiz-title').textContent = currentQuiz.title;
    document.getElementById('quiz-progress').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    document.getElementById('quiz-topic').textContent = `Topic: ${currentQuiz.topic}`;
    
    // Update progress
    document.getElementById('progress-bar').innerHTML = 
        `<div class="progress-fill" style="width: ${progress}%"></div>`;
    document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
    
    // Update question
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // Update options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = currentQuestion.options.map((option, index) => {
        let classes = 'option';
        if (showResult) {
            if (index === currentQuestion.correctAnswer) {
                classes += ' correct';
            } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                classes += ' incorrect';
            }
        } else if (selectedAnswer === index) {
            classes += ' selected';
        }
        
        return `
            <div class="${classes}" onclick="${showResult ? '' : `selectAnswer(${index})`}">
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <span>${option}</span>
                ${showResult && index === currentQuestion.correctAnswer ? '<span style="margin-left: auto;">✅</span>' : ''}
                ${showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer ? '<span style="margin-left: auto;">❌</span>' : ''}
            </div>
        `;
    }).join('');
    
    // Update explanation
    const explanationEl = document.getElementById('explanation');
    if (showResult && currentQuestion.explanation) {
        explanationEl.innerHTML = `
            <h4>Explanation:</h4>
            <p>${currentQuestion.explanation}</p>
        `;
        explanationEl.style.display = 'block';
    } else {
        explanationEl.style.display = 'none';
    }
    
    // Update controls
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('show-answer-btn').style.display = 
        selectedAnswer !== null && !showResult ? 'inline-flex' : 'none';
    document.getElementById('next-btn').disabled = selectedAnswer === null;
    document.getElementById('next-btn').textContent = 
        currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function selectAnswer(index) {
    if (showResult) return;
    selectedAnswer = index;
    updateQuizDisplay();
}

function handleShowAnswer() {
    showResult = true;
    updateQuizDisplay();
}

function handlePrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        selectedAnswer = answers[currentQuestionIndex];
        showResult = false;
        updateQuizDisplay();
    }
}

function handleNext() {
    if (selectedAnswer !== null) {
        answers[currentQuestionIndex] = selectedAnswer;
    }

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        selectedAnswer = answers[currentQuestionIndex];
        showResult = false;
        updateQuizDisplay();
    } else {
        showResults();
    }
}

function showResults() {
    const correctAnswers = answers.filter((answer, index) => 
        answer === currentQuiz.questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    
    // Hide quiz elements
    document.getElementById('quiz-header').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('question-card').style.display = 'none';
    document.getElementById('quiz-controls').style.display = 'none';
    
    // Show results
    const resultsCard = document.getElementById('results-card');
    resultsCard.style.display = 'block';
    
    // Update score display
    const scoreEl = document.getElementById('final-score');
    const badgeEl = document.getElementById('score-badge');
    
    scoreEl.textContent = `${score}%`;
    
    if (score >= 80) {
        scoreEl.className = 'score excellent';
        badgeEl.textContent = 'Excellent!';
        badgeEl.className = 'score-badge excellent';
    } else if (score >= 60) {
        scoreEl.className = 'score good';
        badgeEl.textContent = 'Good!';
        badgeEl.className = 'score-badge good';
    } else {
        scoreEl.className = 'score poor';
        badgeEl.textContent = 'Try Again!';
        badgeEl.className = 'score-badge';
    }
    
    // Update stats
    document.getElementById('total-questions').textContent = currentQuiz.questions.length;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('incorrect-answers').textContent = currentQuiz.questions.length - correctAnswers;
}

function handleRestartQuiz() {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    answers = new Array(currentQuiz.questions.length).fill(null);
    showResult = false;
    
    updatePlayView();
    updateQuizDisplay();
}

// Utility functions
function viewDocument(documentId) {
    const document = documents.find(d => d.id === documentId);
    if (document) {
        alert(`Document: ${document.name}\n\nContent preview:\n${document.content.substring(0, 200)}...`);
    }
}

function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

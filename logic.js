const questions = [
    // 성취 욕구 문항
    {
        text: "나는 도전적인 목표를 세우고 그것을 달성할 때 큰 만족을 느낀다.",
        category: "achievement"
    },
    {
        text: "나는 다른 사람의 기준보다 스스로 설정한 높은 기준에 따라 행동한다.",
        category: "achievement"
    },
    {
        text: "나는 구체적인 피드백을 통해 나의 성과를 측정받는 것을 선호한다.",
        category: "achievement"
    },
    {
        text: "나는 일을 잘 해냈을 때, 타인의 인정보다 내 자신의 성취감에 더 만족을 느낀다.",
        category: "achievement"
    },

    // 권력 욕구 문항
    {
        text: "나는 팀이나 조직 내에서 주도적인 위치를 갖는 것을 중요하게 생각한다.",
        category: "power"
    },
    {
        text: "나는 타인의 결정이나 행동에 영향을 미칠 수 있을 때 동기부여가 된다.",
        category: "power"
    },
    {
        text: "나는 다른 사람들을 이끌거나 방향을 제시하는 역할에 만족을 느낀다.",
        category: "power"
    },
    {
        text: "나는 조직 내에서 영향력을 넓히는 것이 중요하다고 느낀다.",
        category: "power"
    },

    // 친화 욕구 문항
    {
        text: "나는 다른 사람들과의 좋은 관계를 유지하는 것이 매우 중요하다고 생각한다.",
        category: "affiliation"
    },
    {
        text: "나는 사람들이 나를 좋아하고 받아들여주기를 바란다.",
        category: "affiliation"
    },
    {
        text: "나는 협력적이고 조화로운 분위기에서 가장 잘 일할 수 있다.",
        category: "affiliation"
    },
    {
        text: "나는 갈등 상황을 피하고 가능한 한 관계를 원만하게 유지하려고 한다.",
        category: "affiliation"
    }
];

let shuffledQuestions = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startSurvey() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('survey-form').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // 문항 섞기
    shuffledQuestions = shuffleArray([...questions]);
    
    // 설문 폼 생성
    const form = document.getElementById('survey-form');
    form.innerHTML = '';
    
    shuffledQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${question.text}</p>
            <div class="scale">
                ${[1, 2, 3, 4, 5].map(value => `
                    <label>
                        <input type="radio" name="q${index}" value="${value}" required>
                        <br>${value}점
                    </label>
                `).join('')}
            </div>
        `;
        form.appendChild(questionDiv);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.innerHTML = '<button onclick="calculateResults()">결과 보기</button>';
    form.appendChild(buttonContainer);
}

function checkAllAnswered() {
    const questions = document.querySelectorAll('.question');
    for (let i = 0; i < questions.length; i++) {
        const answered = questions[i].querySelector('input:checked');
        if (!answered) return false;
    }
    return true;
}

function calculateResults() {
    if (!checkAllAnswered()) {
        alert('모든 문항에 답변해주세요.');
        return;
    }

    const scores = {
        achievement: 0,
        power: 0,
        affiliation: 0
    };

    shuffledQuestions.forEach((question, index) => {
        const answer = document.querySelector(`input[name="q${index}"]:checked`).value;
        scores[question.category] += parseInt(answer);
    });

    showResults(scores);
}

function showResults(scores) {
    document.getElementById('survey-form').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    // 점수 표시
    document.getElementById('result-scores').innerHTML = `
        <div style="text-align: left;">
            <p>성취 욕구: ${scores.achievement}점</p>
            <p>권력 욕구: ${scores.power}점</p>
            <p>친화 욕구: ${scores.affiliation}점</p>
            <p style="font-size: 0.9em; color: #666;">(각 항목별 최대값은 20점 입니다.)</p>
        </div>
    `;

    // 레이더 차트 생성
    const ctx = document.getElementById('radar-chart').getContext('2d');
    
    // 이전 차트가 있다면 제거
    if (window.myRadarChart) {
        window.myRadarChart.destroy();
    }
    
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['성취 욕구', '권력 욕구', '친화 욕구'],
            datasets: [{
                label: '욕구 프로필',
                data: [scores.achievement, scores.power, scores.affiliation],
                backgroundColor: 'rgba(0, 70, 127, 0.2)',
                borderColor: 'rgba(0, 70, 127, 1)',
                pointBackgroundColor: 'rgba(0, 70, 127, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 70, 127, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 4,
                    suggestedMax: 20,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#800000'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function restartSurvey() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('survey-form').style.display = 'none';
    document.getElementById('results').style.display = 'none';
} 
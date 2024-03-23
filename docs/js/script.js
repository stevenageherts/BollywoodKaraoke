let songDict = {};
let fileToIndexDict = {};
let currentAudio = null;

// Fetch both song dictionaries
Promise.all([
    fetch('file_to_index.json').then(response => response.json()),
    fetch('index_to_file.json').then(response => response.json())
]).then(([fileToIndex, indexToFile]) => {
    songDict = fileToIndex;
    fileToIndexDict = indexToFile;
    searchSong(); // Display all songs initially
}).catch(error => console.error('Error loading JSON:', error));

function searchSong() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const resultsElement = document.getElementById('searchResults');
    resultsElement.innerHTML = ''; // Clear previous results

    let filteredSongs = Object.entries(songDict).filter(([song, _]) =>
        query.trim() === '' || song.toLowerCase().includes(query)
    );

    // Display filtered songs
    filteredSongs.forEach(([song, number]) => {
        const listItem = document.createElement('li');
        listItem.className = 'result-item';
        
        const playButton = document.createElement('button');
        playButton.textContent = '▶ Play';
        playButton.onclick = () => playSample(number);
        playButton.className = 'play-button'; // Ensure this matches your CSS class

        const indexSpan = document.createElement('span');
        indexSpan.className = 'song-index';
        indexSpan.textContent = `${number}`;

        const songTitle = document.createElement('span');
        songTitle.className = 'song-title'; // Ensure this matches your CSS for the song title
        songTitle.textContent = song;

        listItem.appendChild(indexSpan);
        listItem.appendChild(playButton);
        listItem.appendChild(songTitle);
        resultsElement.appendChild(listItem);
    });
}

function playSample(index) {
    if (currentAudio) {
        currentAudio.pause(); // Stop currently playing audio
        currentAudio = null;
    }

    const filename = fileToIndexDict[index];
    if (filename) {
        const audioPath = `./samples/${filename}.mp3`; // Adjust path as necessary
        currentAudio = new Audio(audioPath);
        currentAudio.play().catch(e => console.error("Error playing audio:", e));
    }
}

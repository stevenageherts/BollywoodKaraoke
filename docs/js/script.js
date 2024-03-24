glet fileToIndexDict = {};
let indexToFileDict = {};
let currentAudio = null;

// Fetch both song dictionaries
Promise.all([
    fetch('./assets/json/file_to_index.json').then(response => response.json()),
    fetch('./assets/json/index_to_file.json').then(response => response.json())
]).then(([fileToIndex, indexToFile]) => {
    fileToIndexDict = fileToIndex;
    indexToFileDict = indexToFile;
    searchSong(); // Display all songs initially
}).catch(error => console.error('Error loading JSON:', error));

function searchSong() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const resultsElement = document.getElementById('searchResults');
    resultsElement.innerHTML = ''; // Clear previous results

    let filteredSongs = Object.entries(fileToIndexDict).filter(([song, _]) =>
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

    const filename = indexToFileDict[index];
    if (filename) {
        const audioPath = `./assets/samples/${filename}.mp3`; // Adjust path as necessary
        currentAudio = new Audio(audioPath);
        currentAudio.play().catch(e => console.error("Error playing audio:", e));
    }
}

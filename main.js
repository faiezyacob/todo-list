window.addEventListener('load', () => {
    const pastelColors = [
        {light: '#DFCEF0', dark: '#9059C8'}, // pastel purple
        {light: '#FAEDDA', dark: '#A9824A'}, // pastel peach
        {light: '#C8E0FD', dark: '#4873A5'}, // pastel blue
        {light: '#FFD1F4', dark: '#B64D9C'}, // pastel pink
        {light: '#FFD2B8', dark: '#AA6E4B'}, // pastel orange
        {light: '#CBF9D9', dark: '#47A263'} // pastel green
    ];
    const root = document.documentElement;

    let inputEl;
    let inputBtn;
    let inputWrapper;
    let listWrapper;
    let listChecked;
    let listUnchecked;
    let taskWrapper;
    let taskStorage = [];

    let popupHelper;

    initClass();

    function initClass() {
        inputEl = document.getElementById('input__field');
        inputBtn = document.getElementById('input__button');
        inputWrapper = document.querySelector('.input__wrapper');
        listChecked = document.querySelector('.list__checked');
        listUnchecked = document.querySelector('.list__unchecked');
        listWrapper = document.querySelector('.list__wrapper');
        taskWrapper = document.querySelector('.task__wrapper');

        appendData();
        setRandomBgColor();
        appendColor();
        bindEvents();

        popupHelper = new PopupHelper();
    }

    function appendColor() {
        const bgChangerEl = document.querySelector('.background__changer');
        shuffleArray(pastelColors);
        for (let i = 0; i < pastelColors.length; i++) {
            const colorEl = document.createElement('div');
            colorEl.classList.add('color__list');
            colorEl.style.background = pastelColors[i].light;
            colorEl.setAttribute('data-color', pastelColors[i].light);
            colorEl.setAttribute('data-color-dark', pastelColors[i].dark);
            colorEl.addEventListener('click', onColorElClick);
            bgChangerEl.appendChild(colorEl);
        }
    }

    function appendData() {
        const savedData = JSON.parse(localStorage.getItem('data-task'));
        if (!savedData) {
            return;
        }

        taskStorage = savedData;

        if (taskStorage.length === 0) {
            taskWrapper.innerHTML = '<h4>You have no task</h4>';
            return;
        }

        listChecked.innerHTML = '';
        listUnchecked.innerHTML = '';
        taskWrapper.innerHTML = '<h4>Current task</h4>';
        taskWrapper.innerHTML += '<span>Clear</span>'

        for (let i = 0; i < taskStorage.length; i++) {
            const listContainer = document.createElement('div');
            const listEl = document.createElement('div');
            const deleteEl = document.createElement('i');   
            listContainer.classList.add('list__container');
            listContainer.setAttribute('data-id', taskStorage[i].id);
            listEl.innerHTML = taskStorage[i].task;
            deleteEl.classList.add('fa-solid', 'fa-trash');
            listContainer.appendChild(listEl);
            listContainer.appendChild(deleteEl);
            if (taskStorage[i].checked) {
                listContainer.classList.add('checked');
                listChecked.appendChild(listContainer);
            } else {
                listUnchecked.appendChild(listContainer);
            }
        }

    }

    function bindEvents() {
        inputEl.addEventListener('input', onInputElInput);
        inputEl.addEventListener('focus', onInputElFocus);
        inputBtn.addEventListener('click', onInputBtnClick);
        listWrapper.addEventListener('click', onListWrapperClick);
        taskWrapper.addEventListener('click', onTaskWrapperClick);
    }

    function onColorElClick() {
        const dataColor = this.getAttribute('data-color');
        const dataColorDark = this.getAttribute('data-color-dark');
        root.style.setProperty('--bg-color', this.getAttribute('data-color'));
        root.style.setProperty('--bg-color-dark', this.getAttribute('data-color-dark'));
        localStorage.setItem('data-color', JSON.stringify({light: dataColor, dark: dataColorDark}));
    }

    function onDelete() {
        taskStorage = [];
        listChecked.innerHTML = '';
        listUnchecked.innerHTML = '';
        storeData();
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') {
            onInputBtnClick();
        }
    }

    function onInputElFocus() {
        document.addEventListener('keydown', onKeyDown);
    }

    function onInputElInput() {
        inputWrapper.classList.remove('error');
    }

    function onInputBtnClick() {
        if (inputEl.value.trim() === '') {
            inputWrapper.classList.add('error');
            return;
        }

        let data = {
            id: Date.now(),
            task: inputEl.value,
            checked: false,
        };

        taskStorage.unshift(data);
        storeData();
        inputEl.value = '';
    }

    function onListWrapperClick(e) {
        const elID = parseInt(e.target.parentElement.getAttribute('data-id'));

        for (let i = 0; i < taskStorage.length; i++) {
            if (taskStorage[i].id === elID) {
                if (e.target.nodeName === 'DIV') {
                    taskStorage[i].checked = !taskStorage[i].checked;
                } else if (e.target.nodeName === 'I') {
                    taskStorage.splice(i, 1);
                }
            }
        }

        storeData();
    }

    function onTaskWrapperClick(e) {
        if (e.target.nodeName !== 'SPAN') {
            return;
        }

        popupHelper.show({ content: 'This will remove all your task. Do you wish to proceed?', callback: onDelete });
    }

    function storeData() {
        localStorage.setItem('data-task', JSON.stringify(taskStorage));
        appendData();
    }

    function setRandomBgColor() {
        if (localStorage.getItem('data-color') !== null) {
            const dataColor = JSON.parse(localStorage.getItem('data-color'));
            root.style.setProperty('--bg-color', dataColor.light);
            root.style.setProperty('--bg-color-dark', dataColor.dark);
            return;
        }

        shuffleArray(pastelColors);
        const randomNum = Math.floor(Math.random() * pastelColors.length - 1) + 1;
        const bgColor = pastelColors[randomNum];
        root.style.setProperty('--bg-color', bgColor.light);
        root.style.setProperty('--bg-color-dark', bgColor.dark);
    }

    function shuffleArray(array) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function PopupHelper() {
        this.show = show;

        let cancelBtn;
        let popupContent;
        let popupWrapper;
        let proceedBtn;
        let callback;

        initClass();

        function initClass() {
            cancelBtn = document.querySelector('.cancel__btn');
            popupContent = document.querySelector('.popup__body');
            popupWrapper = document.querySelector('.popup__helper__wrapper');
            proceedBtn = document.querySelector('.proceed__btn');

            bindEvents();
        }

        function show(data) {
            popupWrapper.classList.add('active');
            popupContent.innerHTML = data.content;
            callback = data.callback;
        }

        function bindEvents() {
            cancelBtn.addEventListener('click', onCancelBtnClick);
            proceedBtn.addEventListener('click', onProceedBtnClick);
        }

        function onCancelBtnClick() {
            popupWrapper.classList.remove('active');
        }

        function onProceedBtnClick() {
            if (typeof callback !== 'function') {
                return;
            }

            onCancelBtnClick();
            callback();
        }
    }
})
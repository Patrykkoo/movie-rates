document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.querySelector('.tabs-container');
    
    if (!tabContainer) {
        return;
    }

    const tabLinks = tabContainer.querySelectorAll('.tab-link');
    const tabPanes = tabContainer.querySelectorAll('.tab-pane');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPaneId = tab.dataset.tab;

            tabLinks.forEach(link => link.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetPaneId).classList.add('active');
        });
    });
});
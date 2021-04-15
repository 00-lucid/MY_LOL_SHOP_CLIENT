import axios from 'axios';

export default {
    postBell(token, text, handleBellBadges, handleBells, handleIsAction) {
        if (token) {

            axios.post('https://localhost:3000/add-bell', {
                text: text
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                handleBellBadges(old => [...old, {id : old.length + 1}]);
                handleBells(old => [...old, {text: res.data.text, createdAt: res.data.createdAt}])
                handleIsAction(old => !old);
            })
        }
    }
}

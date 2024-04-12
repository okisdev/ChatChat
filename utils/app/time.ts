export const whatTimeOfDay = () => {
    const currentTime = new Date().getHours();

    if (currentTime < 12) {
        return 'good_morning';
    } else if (currentTime < 18) {
        return 'good_afternoon';
    } else {
        return 'good_evening';
    }
};

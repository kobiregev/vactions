const followSorter = async (followedVacations, vacations) => {
    let filterArr = followedVacations.map(vacation => vacation.vacation_id)
    let notFollowedVacations = vacations.filter(v => !filterArr.includes(v.vacation_id))
    let userFollowedVacations = vacations.filter(v => filterArr.includes(v.vacation_id))
    userFollowedVacations.map(v => v['isfollowed'] = true)
    let results = [...userFollowedVacations, ...notFollowedVacations]
    return results
}
module.exports = followSorter
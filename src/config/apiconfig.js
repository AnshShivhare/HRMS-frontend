const url = "http://localhost:8000/api/v1"; //ansh

const ApiConfig = {
login: `${url}/employee/login`,
register:`${url}/employee/register`,
checkIn:`${url}/employee/attendance/check-in`,
checkOut:`${url}/employee/attendance/check-out`,
employees:`${url}/hr/all-employee`,
removeEmployee:`${url}/hr/remove-employee`,
getEmployeeCount:`${url}/hr/all-employee-count`,
apply:`${url}/leave/apply`,
leaves:`${url}/leave/get-all-leave`,
update:`${url}/leave/update-status`
}
export default ApiConfig;

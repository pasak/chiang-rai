const axios = require('axios')
async function pushMessage( access_token, to, messages ) {
    const axios = require('axios')

    let headers = {
        'Content-Type':  'application/json', 
        'Authorization': 'Bearer ' + access_token 
    }  
    
    let data = { to: to, messages: messages }

    axios.post('https://api.line.me/v2/bot/message/push', data, {
        headers: headers   
    }).then((res) => { 
        // return res 
        console.log('then ' + JSON.stringify(res.response.data)) 
    }).catch((error) => {
        // return error 
        try{
            console.log(JSON.stringify(error))
        } catch(err){
            console.log(err)
        }
    })
} // pushMessage
async function repyMessage( access_token, replyToken, messages ) {
    const axios = require('axios')

    let headers = {
        'Content-Type':  'application/json', 
        'Authorization': 'Bearer ' + access_token 
    }  
    
    let data = { replyToken: replyToken, messages: messages }

    axios.post('https://api.line.me/v2/bot/message/reply', data, {
        headers: headers   
    }).then((res) => { 
        // return res 
        console.log('then ' + JSON.stringify(res.response.data)) 
    }).catch((error) => {
        // return error 
        try{
            console.log(JSON.stringify(error))
        } catch(err){
            console.log(err)
        }
    })
} // repyMessage

const getLabel = (L)=>{
return {
All:            (L=='th') ? 'ทั้งหมด' : (L=='zh') ? '全部' : 'All', 
Once:           (L=='th') ? 'ครั้งเดียว' : (L=='zh') ? '一次' : 'Once', 
Year:           (L=='th') ? 'ปี' : (L=='zh') ? '年' : 'Year', 
Month:          (L=='th') ? 'เดือน' : (L=='zh') ? '月' : 'Month', 
Week:           (L=='th') ? 'สัปดาห์' : (L=='zh') ? '星期' : 'Week', 
Day:            (L=='th') ? 'วัน'    : (L=='en') ? 'Day(s)' : '天',
Time:           (L=='th') ? 'เวลา'  : (L=='en') ? 'Time' : '时间',

Team:           (L=='th') ? 'ทีม' : (L=='zh') ? '团队' : 'Team', 

SignOut:        (L=='th') ? 'ออกจากระบบ' : (L=='zh') ? '登出' : 'Sign out', 

Search:         (L=='th') ? 'ค้นหา' : (L=='zh') ? '搜索' : 'Search', 
List:           (L=='th') ? 'รายชื่อ' : (L=='zh') ? '列表' : 'List', 
View:           (L=='th') ? 'ดู'    : (L=='zh') ? '手表'   : 'View', 
Add:            (L=='th') ? 'เพิ่ม' : (L=='zh') ? '增加' : 'Add', 
Edit:           (L=='th') ? 'แก้ไข' : (L=='zh') ? '正确的' : 'Edit', 
Delete:         (L=='th') ? 'ลบ'   : (L=='zh') ? '删除'   : 'Delete', 
Save:           (L=='th') ? 'บันทึก' : (L=='zh') ? '记录'   : 'Save', 
Cancel:         (L=='th') ? 'ยกเลิก' : (L=='zh') ? '取消'   : 'Cancel', 
ConfirmCancel:  (L=='th') ? 'ยืนยันการยกเลิก' : (L=='zh') ? '确认取消'   : 'Confirm cancellation', 
DeleteConfirm:  (L=='th') ? 'แน่ใจว่าจะลบ ?' : (L=='zh') ? '一定要删除 ?' : 'Are you sure you want to delete ?', 
IsActive:       (L=='th') ? 'ใช้งาน' : (L=='zh') ? '积极的' : 'Active', 

Seq:            (L=='th') ? 'ลำดับที่' : (L=='zh') ? '不。' : 'Seq', 
Name:           (L=='th') ? 'ชื่อ' : (L=='zh') ? '姓名' : 'Name', 

UserName:       (L=='th') ? 'ชื่อผู้ใช้' : (L=='zh') ? '用户名' : 'User name', 
Password:       (L=='th') ? 'รหัสผ่าน' : (L=='zh') ? '密码' : 'Password', 
ConfirmPassword: (L=='th') ? 'ยืนยันรหัสผ่าน' : (L=='zh') ? '确认密码' : 'Confirm password', 
Role:           (L=='th') ? 'หน้าที่' : (L=='zh') ? '角色' : 'Role', 

UserNameMustUnique: (L=='th') ? 'ชื่อผู้ใช้ ต้องไม่ซ้ำกับที่มีอยู่' : (L=='zh') ? '用户名必须与现有用户名不同。' : 
                    'Username must be unique from an existing username.', 

UserNameMustNotSpaces:  (L=='th') ? 'User Name ต้องไม่มีช่องว่าง' : (L=='zh') ? 'User Name 不得包含空格。' : 
                        'User Name must not contain spaces.', 

UserNameMustAlphanumeric: (L=='th') ? 'User Name ต้องประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวเลข ขีดกลาง หรือขีดล่าง เท่านั้น' : 
                          (L=='zh') ? 'User Name 只能包含英文字母、数字、破折号或下划线。' : 
                          'User Name must contain only English letters, numbers, dashes or underscores.', 

PasswordNotMatch:   (L=='th') ? 'รหัสผ่าน ไม่เหมือนกับ ยืนยันรหัสผ่าน' : (L=='zh') ? '密码与确认密码不同。' : 
                    'Password is not the same as Confirm Password.', 

TeamMember:     (L=='th') ? 'ทีมงาน' : (L=='zh') ? '团队成员' : 'Team member', 
TeamLeader:     (L=='th') ? 'หัวหน้าทีม' : (L=='zh') ? '' : 'Team leader', 
Admin:          (L=='th') ? 'แอดมิน' : (L=='zh') ? '管理' : 'Admin', 

ID:             (L=='th') ? 'ID' : (L=='zh') ? '' : 'ID', 
FirstName:      (L=='th') ? 'ชื่อ' : (L=='en') ? 'First Name' : '姓名',
LastName:       (L=='th') ? 'นามสกุล' : (L=='en') ? 'Last Name'  : '姓',
NickName:       (L=='th') ? 'ชื่อเล่น' : (L=='zh') ? '昵称' : 'Nick Name', 
Telephone:      (L=='th') ? 'โทรศัพท์' : (L=='en') ? 'Telephone' : '电话',
Email:          (L=='th') ? 'อีเมล' : (L=='zh') ? '电子邮件' : 'Email', 
Picture:        (L=='th') ? 'รูปภาพ' : (L=='zh') ? '图片' : 'Picture', 
BirthDate:      (L=='th') ? 'วันเกิด' : (L=='zh') ? '出生日期' : 'Birth Date', 
ElectionDistrictNumber: (L=='th') ? 'เขตเลือกตั้งที่' : (L=='zh') ? '选区编号' : 'Election district number', 

Province:       (L=='th') ? 'จังหวัด' : (L=='zh') ? '省' : 'Province', 
District:       (L=='th') ? 'อำเภอ / เขต' : (L=='zh') ? '' : 'District', 
SubDistrict:    (L=='th') ? 'ตำบล / แขวง' : (L=='zh') ? '' : 'Sub district', 

Title:          (L=='th') ? 'คำนำหน้า' : (L=='zh') ? '' : 'Title', 
Mr:             (L=='th') ? 'นาย' : (L=='zh') ? '' : 'Mr.', 
Ms:             (L=='th') ? 'นางสาว' : (L=='zh') ? '' : 'Ms.', 
Mrs:            (L=='th') ? 'นาว' : (L=='zh') ? '' : 'Mrs.', 
Other:          (L=='th') ? 'อื่น ๆ' : (L=='zh') ? '' : 'Other', 

MemberType:     (L=='th') ? 'ประเภทสมาชิก' : (L=='zh') ? '' : 'Member type', 
MemberRole:     (L=='th') ? 'บทบาท' : (L=='zh') ? '' : 'Member role', 
ColorCode:      (L=='th') ? 'รหัสสี' : (L=='zh') ? '' : 'Color code', 
OperationType:  (L=='th') ? 'ประเภทงาน' : (L=='zh') ? '' : 'Operation type', 
OperationStatus:(L=='th') ? 'สถานะงาน' : (L=='zh') ? '' : 'Operation status', 

green:          (L=='th') ? 'เขียว' : (L=='zh') ? '' : 'Green', 
yellow:         (L=='th') ? 'เหลือง' : (L=='zh') ? '' : 'Yellow', 
red:            (L=='th') ? 'แดง' : (L=='zh') ? '' : 'Red', 

MasterField:    (L=='th') ? 'Master field' : (L=='zh') ? '' : 'Master field', 
FieldName:      (L=='th') ? 'ชื่อฟิลด์' : (L=='zh') ? '' : 'Field name', 
Value:          (L=='th') ? 'ค่า' : (L=='zh') ? '价值' : 'Value', 
Choice:         (L=='th') ? 'ตัวเลือก' : (L=='zh') ? '选择' : 'Choice', 

NO_USER_ID:     (L=='th') ? 'ไม่พบรหัสนี้' : (L=='zh') ? '无法找到该 ID' : 'This ID could not be found.', 
WELCOME_USER:   (L=='th') ? 'ยินดีต้อนรับคุณ' : (L=='zh') ? 'Welcome' : 'Welcome', 
WORK_ROLE:      (L=='th') ? 'ปฏิบัติงานหน้าที่' : (L=='zh') ? '角色工作' : 'work in role', 
UnknowCommand:  (L=='th') ? 'คำสั่งที่ไม่รู้จัก' : (L=='zh') ? '未知的命令' : 'Unknow command',

People:         (L=='th') ? 'ประชาชน' : (L=='zh') ? '' : 'People', 
PostalCode:     (L=='th') ? 'รหัสไปรษณีย์' : (L=='zh') ? '' : 'Postal code', 
Address:        (L=='th') ? 'ที่อยู่' : (L=='zh') ? '' : 'Address', 
Road:           (L=='th') ? 'ถนน' : (L=='zh') ? '' : 'Road', 
Village:        (L=='th') ? 'หมู่บ้าน' : (L=='zh') ? '' : 'Village', 
PollingStationNumber:   (L=='th') ? 'หน่วยเลือกตั้งที่' : (L=='zh') ? '' : 'Polling Station Number', 
PollingStationName:     (L=='th') ? 'ชื่อหน่วยเลือกตั้ง' : (L=='zh') ? '' : 'Polling Station Name', 
HaveVotingRights:       (L=='th') ? 'มีสิทธิเลือกตั้ง' : (L=='zh') ? '' : 'Have Voting Rights', 
NoHaveVotingRights:     (L=='th') ? 'ไม่มีสิทธิเลือกตั้ง' : (L=='zh') ? '' : 'No have Voting Rights', 
Remark:         (L=='th') ? 'หมายเหตุ' : (L=='zh') ? '评论' : 'Remark', 

SelectField:        (L=='th') ? 'เลือกฟิลด์' : (L=='zh') ? '' : 'Select field', 
EnterSearchTerm:    (L=='th') ? 'ป้อนคำค้นหา' : (L=='zh') ? '' : 'Enter a search term.', 
SelectDistrict:     (L=='th') ? 'เลือกอำเภอ / เขต' : (L=='zh') ? '' : 'Select district', 
SelectSubDistrict:  (L=='th') ? 'เลือกตำบล / แขวง' : (L=='zh') ? '' : 'Select sub district', 

Operation:      (L=='th') ? 'ปฏิบัติการ' : (L=='zh') ? '' : 'Operation', 
OperationName:  (L=='th') ? 'ชื่อปฏิบัติการ' : (L=='zh') ? '操作名称' : 'Operation name', 
OperationDescription: (L=='th') ? 'รายละเอียดปฏิบัติการ' : (L=='zh') ? '操作描述' : 'Operation description',
Status:         (L=='th') ? 'สถานะ' : (L=='zh') ? '地位' : 'Status',
Type:           (L=='th') ? 'ประเภท' : (L=='zh') ? '类型' : 'Type', 
Date:           (L=='th') ? 'วันที่' : (L=='zh') ? '' : 'Date', 
BeginDateTime:  (L=='th') ? 'วันเวลาเริ่มต้น' : (L=='zh') ? '' : 'Begin date time', 
EndDateTime:    (L=='th') ? 'วันเวลาสิ้นสุด' : (L=='zh') ? '' : 'End date time', 
Description:    (L=='th') ? 'รายละเอียด' : (L=='en') ? 'Description' : '细节',
ExpectedAmount: (L=='th') ? 'จำนวนคาดหวัง' : (L=='zh') ? '' : 'Expected amount ', 
ActualAmount:   (L=='th') ? 'จำนวนคน' : (L=='zh') ? '' : 'Actual amount', 
ResponsibleName:(L=='th') ? 'ผู้รับผิดชอบ' : (L=='zh') ? '' : 'Responsible name', 
SupervisorName: (L=='th') ? 'หัวหน้า' : (L=='zh') ? '' : 'Supervisor name ', 

FileSizeLimit10:(L=='th') ? 'ขนาดไฟล์ต้องไม่เกิน 10 MB' : (L=='zh') ? '文件大小不得超过 10 MB。' : 'File size must not exceed 10 MB.',
PlaceName:      (L=='th') ? 'ชื่อสถานที่' : (L=='zh') ? '' : 'Place name', 

FromDate:       (L=='th') ? 'จากวันที่' : (L=='zh') ? '从日期' : 'From date', 
ToDate:         (L=='th') ? 'ถึงวันที่' : (L=='zh') ? '最新' : 'To date', 
CreatedDate:    (L=='th') ? 'วันที่สร้าง' : (L=='zh') ? '创建日期' : 'Created date', 

//:        (L=='th') ? '' : (L=='zh') ? '' : '', 

//:        (L=='th') ? '' : (L=='zh') ? '' : '', 

} // return
} // getLabel

module.exports = { getLabel, pushMessage, repyMessage }


/*
Branch:         (L=='th') ? 'สาขา'  : (L=='en') ? 'Branch' : '分支',

SelfDrive:      (L=='th') ? 'ขับเอง' : 
                (L=='en') ? 'Self drive' : '自己开车',
IncludedDriver: (L=='th') ? 'รวมคนขับ' : 
                (L=='en') ? 'Included driver' : '包括司机',

PickUpReturnCatAT: (L=='th') ? 'รับรถ/คืนรถที่' : 
                   (L=='en') ? 'Pickup/Return car at' : '取车/还车于',

PickUpDate:     (L=='th') ? 'รับรถวันที่' : (L=='en') ? 'Pick up date' : '取车于',
ReturnCarDate:  (L=='th') ? 'คืนรถวันที่' : (L=='en') ? 'Return date' : '还车',

MinimumRentInterval : (L=='th') ? 'ระยะเวลาในการเช่าขั้นต่ำคือ ' : (L=='en') ? 'Minimum car rent interval is ' : '最短租期为',

Deposit:        (L=='th') ? 'มัดจำ' : (L=='en') ? 'Deposit' : '订金',
NoDeposit:      (L=='th') ? 'ไม่มีมัดจำ' : (L=='en') ? 'No deposit' : '无押金',
THB:            (L=='th') ? 'บาท' : (L=='en') ? 'Baht' : '铢',
PriceFor:       (L=='th') ? 'ราคาสำหรับ' : (L=='en') ? 'Price for' : '价格为',

SeeDetails:     (L=='th') ? 'ดูรายละเอียด' : (L=='en') ? 'See details' : '查看详情',
SelectDateTime: (L=='th') ? 'เลือกวันเวลา' : (L=='en') ? 'Select date & time' : '选择日期和时间',
ChangeDateTime: (L=='th') ? 'เปลี่ยนวันเวลา' : (L=='en') ? 'Change date & time' : '更改日期和时间',

RentalPrice4Day:   (L=='th') ? 'ค่าเช่าวันที่' : (L=='en') ? 'Rent for day' : '日期租赁费',
TotalRentalAmount: (L=='th') ? 'รวมค่าเช่า' : (L=='en') ? 'Total rental amount' : '包含租金',
TotalRentalOptionAmount: (L=='th') ? 'รวมค่าเช่า + ออฟชั่น' : (L=='en') ? 'Total rental + option amount' : '包括租金+选项',

TotalPerCar:    (L=='th') ? 'รวมต่อคัน' : (L=='en') ? 'Total per car' : '每辆车总计',
TotalAllCar:    (L=='th') ? 'รวมทุกคัน' : (L=='en') ? 'Total all car' : '包括所有汽车',
TotalAmount:    (L=='th') ? 'รวมทั้งหมด' : (L=='en') ? 'Total amount' : '全部的',
PaidAmount:     (L=='th') ? 'ชำระแล้ว' : (L=='zh') ? '已付金额' : 'Paid amount', 

Free:           (L=='th') ? 'ฟรี' : (L=='en') ? 'Free' : '自由的',

Amount:         (L=='th') ? 'จำนวน' : (L=='en') ? 'Amount' : '数量',
CarUnit:        (L=='th') ? 'คัน' : (L=='en') ? 'car(s)' : '辆车',

AcceptRentalTerms: (L=='th') ? 'ยอมรับเงื่อนไขการเช่า' : (L=='en') ? 'Accept rental terms' : '接受租赁条款。',

Discount:       (L=='th') ? 'ส่วนลด' : (L=='en') ? 'Discount' : '折扣',
DiscountCode:   (L=='th') ? 'รหัสส่วนลด (ถ้ามี)' : (L=='en') ? 'Discount code (if any)' : '折扣码（如果有）',

BookNow:        (L=='th') ? 'จองเลย' : (L=='en') ? 'Book now' : '现在预订',

NotFoundDiscountCode: (L=='th') ? 'ไม่พบรหัสส่วนลด' : (L=='en') ? 'Discount code is not found' : '未找到折扣码',

CouponNoTimes:  (L=='th') ? 'คุปองถูกใช้หมดแล้ว' : (L=='en') ? 'The coupon has been used up.' : '优惠券已用完。',

CouponNoMinRental: 
    (L=='th') ? 'ค่าเช่า+ออฟชั่น ไม่ถึงจำนวนที่จะใช้คุปองได้' :
    (L=='en') ? 'The rent + option is less than the amount to be able to use the coupon.' : 
                '租金+选项尚未达到优惠券可使用的金额。',

CouponExpired:  (L=='th') ? 'คูปองหมดอายุ' : 
                (L=='en') ? 'Expired coupon' : '优惠券已过期',
CouponUsed:     (L=='th') ? 'คูปองนี้ใช้ไปแล้ว' : 
                (L=='en') ? 'This coupon is used' : '该优惠券已被使用。',

NeedConfirmBooking: 
    (L=='th') ? 'เมื่อคุณจองแล้ว เจ้าหน้าที่จะยืนยันการจองอีกครั้ง' : 
    (L=='en') ? 'Once you have booked, The staff will reconfirm the booking.' : 
                '一旦您预订了工作人员将再次确认预订。',

PayAdvance:     (L=='th') ? 'จ่ายล่วงหน้า' : 
                (L=='en') ? 'Pay in advance' : '提前支付',
PayPickupCar:   (L=='th') ? 'จ่ายเมื่อรับรถ' : 
                (L=='en') ? 'Pay when picking up the car' : '取车时付款',

Customer:       (L=='th') ? 'ลูกค้า' : (L=='zh') ? '顾客' : 'Customer',

                
PlaceDescription: (L=='th') ? 'รายละเอียดสถานที่' : (L=='en') ? 'Place description' : '地点详情',

RentalOrder:    (L=='th') ? 'รายการเช่ารถ' : (L=='en') ? 'Rental Order' : '租车清单',

RentalOrderCode:(L=='th') ? 'รหัสรายการเช่ารถ' : (L=='en') ? 'Rental Order Code' : '租车交易代码',


RC_SelectType:  (L=='th') ? 'ลูกค้าเลือกประเภทรถ' : (L=='zh') ? '客户选择车型' : 'Customer selects car type',

RC_Wait4CustomerLocation: (L=='th') ? 'รอลูกค้าส่ง location' : (L=='zh') ? '等待客户发送位置' : 
                          'Waiting for the customer to send location',

RC_Wait4Approval: (L=='th') ? 'รออนุมัติรายการเช่ารถ' : (L=='zh') ? '等待租车审批' : 'Waiting for car rental approval',

RC_Approved:    (L=='th') ? 'อนุมัติรายการเช่ารถ' : (L=='zh') ? '批准汽车租赁交易' : 'Approve car rental transaction',

RC_NotApproved: (L=='th') ? 'ไม่อนุมัติรายการเช่ารถ' : (L=='zh') ? '租车交易未获批准' : 'Car rental transaction not approved',

RC_Wait4AdvancePayment: (L=='th') ? 'รอการชำระเงินล่วงหน้า' : (L=='zh') ? '等待预付款' : 'Waiting for advance payment',

RC_ExpireCustomerLocation: (L=='th') ? 'ยกเลิก เนื่องจากลูกค้าไม่ส่ง location' : (L=='zh') ? '由于客户未发送位置而取消。' : 
                "Canceled because the customer didn't send the location.",

RC_ExpireAdvancePayment: (L=='th') ? 'ยกเลิก เนื่องจากลูกค้าไม่ชำระเงินล่วงหน้า' : (L=='zh') ? '由于客户没有提前付款而取消。' : 
                         "Canceled because the customer didn't pay in advance.",

RC_CancelByCustomer: (L=='th') ? 'ยกเลิกโดยลูกค้า' : (L=='zh') ? '客户取消' : 'Cancellation by customer', 

RC_CancelByAdmin:    (L=='th') ? 'ยกเลิกโดยแอดมิน' : (L=='zh') ? '已被管理员取消' : 'Cancelled by admin', 

RC_Confirm:          (L=='th') ? 'ยืนยันรายการเช่ารถ' : (L=='zh') ? '确认租车清单' : 'Confirm car rental transaction',

RC_InformPayment:       (L=='th') ? 'แจ้งชำระเงิน' : (L=='zh') ? '付款通知' : 'Notification of payment', 


RC_Wait4SelectDriver:   (L=='th') ? 'รอเลือกพนักงานขับรถ' : (L=='zh') ? '等待选择驱动程序' : 'Waiting to select a driver', 

RC_DriverSelected:      (L=='th') ? 'เลือกพนักงานขับรถแล้ว' : (L=='zh') ? '已选择司机' : 'Driver selected', 

RC_Wait4Driver2Deliver: (L=='th') ? 'รอพนักงานขับรถไปส่ง' : (L=='zh') ? '等待司机送货' : 'Waiting for the driver to deliver', 

RC_Wait4CustomerPickup: (L=='th') ? 'รอลูกค้ามารับรถ' : (L=='zh') ? '等待客户上门提车' : 'Waiting for the customer to come pick up the car', 

RC_Wait4Driver2Return:  (L=='th') ? 'รอพนักงานขับรถไปรับรถคืน' : (L=='zh') ? '等待司机还车。' : 'Wait for the driver to return the car.', 

RC_Wait4CustomerReturn: (L=='th') ? 'รอลูกค้านำรถมาคืน' : (L=='zh') ? '等待客户还车' : 'Waiting for the customer to return the car', 

RC_CustomerReturnedCar: (L=='th') ? 'ลูกค้าคืนรถแล้ว' : (L=='zh') ? '客户已归还汽车。' : 'The customer has returned the car.', 


LocationText1:  (L=='th') ? 'กรุณากดปุ่ม' : (L=='zh') ? '请按下按钮。' : 'Please press the button.',

LocationText2:  (L=='th') ? 'ด้านล่าง เพื่อส่ง location สำหรับ' : (L=='zh') ? '下面发送位置' : 'below to send location for',

SameAs:         (L=='th') ? 'เหมือนกับ' : (L=='zh') ? '喜欢' : 'Same as',

RC_PlsWaitApproval:(L=='th') ? 'กรุณารออนุมัติรายการเช่ารถ' : (L=='zh') ? '请等待租车批准。' : 'Please wait for car rental approval.',

ApprovedPlsAdvancePayment: (L=='th') ? 'อนุมัติแล้ว กรุณาชำระเงินล่วงหน้า' : (L=='zh') ? '已批准，请先付款。' : 'Approved, please pay in advance.',

Approve:        (L=='th') ? 'อนุมัติ' : (L=='zh') ? '批准' : 'Approve',
NotApproved:    (L=='th') ? 'ไม่อนุมัติ' : (L=='zh') ? '不批准' : 'Not Approved',
CallCustomer:   (L=='th') ? 'โทรหาลุกค้า' : (L=='zh') ? '致电客户' : 'Call a customer',

UnknowCommand:  (L=='th') ? 'คำสั่งที่ไม่รู้จัก' : (L=='zh') ? '未知的命令' : 'Unknow command',

InformReasonCance: (L=='th') ? '' : (L=='zh') ? '' : '',

InformedCustomer:(L=='th') ? 'แจ้งลุกค้าแล้ว' : 
                 (L=='zh') ? '已通知客户。' : 
                 'The customer has been informed.',

SorryDuty:      (L=='th') ? 'ขออภัย ไม่มีรถว่างในวันที่คุณเลือก' : 
                (L=='zh') ? '抱歉，您选择的日期没有可用的车辆。' : 
                'Sorry, there are no cars available on the date you selected.',

PlsSelectAgain: (L=='th') ? 'กรุณาเลือกใหม่' : 
                (L=='zh') ? '请重新选择。' : 'Please select again.',

WithInMinutes:  (L=='th') ? 'ภายใน X นาที' : 
                (L=='zh') ? 'X分钟内' : 'within X minutes',

BeforeTimeX:    (L=='th') ? 'ก่อนเวลา X' : 
                (L=='zh') ? 'X之前' : 'Before X',

Of:             (L=='th') ? 'ของ' : (L=='zh') ? '的' : 'of', 

Provider:       (L=='th') ? 'ผู้ให้บริการ' : (L=='zh') ? '服务提供者' : 'Provider', 

Service:        (L=='th') ? 'บริการ' : (L=='zh') ? '服务' : 'Service', 

DocumentCode:   (L=='th') ? 'รหัสเอกสาร' : (L=='zh') ? '文件代码' : 'Document code', 

RentalType:     (L=='th') ? 'ประเภทการเช่า' : (L=='zh') ? '租赁类型' : 'Rental type', 
VehicleType:    (L=='th') ? 'ประเภทรถ' : (L=='zh') ? '车型' : 'Vehicle type', 

Season:         (L=='th') ? 'ฤดูกาล' : (L=='zh') ? '季节' : 'Season', 

RentalCar:      (L=='th') ? 'รถเช่า' : (L=='zh') ? '汽车租赁' : 'Rental car', 

RentalPrice:    (L=='th') ? 'ค่าเช่า' : (L=='zh') ? '租' : 'Rent', 

Attribute:      (L=='th') ? 'คุณสมบัติ' : (L=='zh') ? '属性' : 'Attribute', 

Option:         (L=='th') ? 'กลุ่มตัวเลือก' : (L=='zh') ? '选项' : 'Option', 
Choice:         (L=='th') ? 'ตัวเลือก' : (L=='zh') ? '选择' : 'Choice', 

Media:          (L=='th') ? 'สื่อ' : (L=='zh') ? '媒体' : 'Media', 

Setting:        (L=='th') ? 'ตั้งค่า' : (L=='zh') ? '环境' : 'Setting', 

CouponType:     (L=='th') ? 'ประเภทคูปอง' : (L=='zh') ? '优惠券类型' : 'Coupon type', 
Coupon:         (L=='th') ? 'คูปอง' : (L=='zh') ? '优惠券' : 'Coupon', 

PaymentTerm:    (L=='th') ? 'เงื่อนไขการชำระเงิน' : (L=='zh') ? '付款期限' : 'Payment term', 

Payment:        (L=='th') ? 'การชำระเงิน' : (L=='zh') ? '支付' : 'Payment', 


Thai:           (L=='th') ? 'ไทย'   : (L=='zh') ? '泰国' : 'Thai', 
English:        (L=='th') ? 'อังกฤษ' : (L=='zh') ? '英格兰' : 'English', 
Chinese:        (L=='th') ? 'จีน'    : (L=='zh') ? '中国' : 'Chinese', 

ThaiName:       (L=='th') ? 'ชื่อภาษาไทย'   : (L=='zh') ? '泰国名字' : 'Thai Name', 
EnglishName:    (L=='th') ? 'ชื่อภาษาอังกฤษ' : (L=='zh') ? '英文名' : 'English Name', 
ChineseName:    (L=='th') ? 'ชื่อภาษาจีน'    : (L=='zh') ? '中文名' : 'Chinese Name', 

ThaiAddress:    (L=='th') ? 'ที่อยู่ภาษาไทย'   : (L=='zh') ? '泰语地址' : 'Thai Address', 
EnglishAddress: (L=='th') ? 'ที่อยู่ภาษาอังกฤษ' : (L=='zh') ? '英文地址' : 'English Address', 
ChineseAddress: (L=='th') ? 'ที่อยู่ภาษาจีน'    : (L=='zh') ? '中文地址' : 'Chinese Address', 

ThaiDescription:    (L=='th') ? 'รายละเอียดภาษาไทย'   : (L=='zh') ? '泰语描述' : 'Thai Description', 
EnglishDescription: (L=='th') ? 'รายละเอียดภาษาอังกฤษ' : (L=='zh') ? '英文说明' : 'English Description', 
ChineseDescription: (L=='th') ? 'รายละเอียดภาษาจีน'    : (L=='zh') ? '中文说明' : 'Chinese Description', 

Module:         (L=='th') ? 'โมดูล' : (L=='zh') ? '模块' : 'Module', 
Fee:            (L=='th') ? 'ค่าบริการ' : (L=='zh') ? '费用' : 'Fee', 
ExpireDate:     (L=='th') ? 'วันหมดอายุ' : (L=='zh') ? '到期日期' : 'Expire date', 

ThaiRentalCondition:    (L=='th') ? 'เงื่อนไขการเช่า ภาษาไทย' : 
                        (L=='zh') ? '租赁条件 泰语' : 
                        'Rental conditions in Thai', 
EnglishRentalCondition: (L=='th') ? 'เงื่อนไขการเช่า ภาษาอังกฤษ' : 
                        (L=='zh') ? '英文租赁条件' : 
                        'Rental conditions in English', 
ChineseRentalCondition: (L=='th') ? 'เงื่อนไขการเช่า ภาษาจีน' : 
                        (L=='zh') ? '中文租赁条件' : 
                        'Rental conditions in Chinese', 

DepositAmount:  (L=='th') ? 'จำนวนเงินมัดจำ' : (L=='zh') ? '存款金额' : 'Deposit amount', 

BeginDate:        (L=='th') ? 'วันเริ่มต้น' : (L=='zh') ? '' : 'Begin date', 
EndDate:          (L=='th') ? 'วันสิ้นสุด' : (L=='zh') ? '' : 'End date', 
WeekDay:          (L=='th') ? 'วันในสัปดาห์' : (L=='zh') ? '一周中的日子' : 'days of the week', 
PriceDiffPercent: (L=='th') ? '% เพิ่ม/ลดของค่าเช่า' : (L=='zh') ? '主要租金增加/减少百分比' : '% increase/decrease of rent', 
ExtraDiffPercent: (L=='th') ? '% เพิ่ม/ลดของส่วนเพิ่ม' : (L=='zh') ? '额外租金增加/减少的百分比' : '% increase/decrease of additional', 

BeginTime:        (L=='th') ? 'เวลาเริ่มต้น' : (L=='zh') ? '开始时间' : 'Begin time', 
EndTime:          (L=='th') ? 'เวลาสิ้นสุด' : (L=='zh') ? '时间结束' : 'End time', 

Sunday:         (L=='th') ? 'อาทิตย์' : (L=='zh') ? '星期日' : 'Sunday', 
Monday:         (L=='th') ? 'จันทร์' : (L=='zh') ? 'Monday' : 'Monday', 
Tuesday:        (L=='th') ? 'อังคาร' : (L=='zh') ? '周二' : 'Tuesday', 
Wednesday:      (L=='th') ? 'พุธ' : (L=='zh') ? '周三' : 'Wednesday', 
Thursday:       (L=='th') ? 'พฤหัส' : (L=='zh') ? '周四' : 'Thursday', 
Friday:         (L=='th') ? 'ศุกร์' : (L=='zh') ? '星期五' : 'Friday', 
Saturday:       (L=='th') ? 'เสาร์' : (L=='zh') ? '周六' : 'Saturday', 

IntervalType:   (L=='th') ? 'ประเภทช่วงเวลา' : (L=='zh') ? '间隔类型' : 'Interval Type', 
IntervalNumber: (L=='th') ? 'จำนวนช่วงเวลา' : (L=='zh') ? '间隔数' : 'Number of interval', 
MinimumNumber:  (L=='th') ? 'จำนวนขั้นต่ำ' : (L=='zh') ? '最低数量' : 'Minimum number', 
Price:          (L=='th') ? 'ราคา' : (L=='zh') ? '价格' : 'Price', 

ROTC:           (L=='th') ? 'บังคับเลือก 1 อย่าง' : 
                (L=='zh') ? '被迫选择1件事' : 'Forced to choose 1 thing', 
ROT1:           (L=='th') ? 'เลือกได้ 1 อย่าง' : 
                (L=='zh') ? '您可以选择 1 件事。': 'Can choose 1 thing', 
ROTM:           (L=='th') ? 'เลือกได้หลายอย่าง' : 
                (L=='zh') ? '您可以从很多事情中进行选择。' : 
                'Can choose from many things', 


PeriodType:     (L=='th') ? 'ประเภทเวลาการชำระเงิน' : 
                (L=='zh') ? '付款期限类型' : 'Payment period type', 
Now:            (L=='th') ? 'ทันที' : (L=='zh') ? '现在' : 'Now', 
WhenPickUpCar:  (L=='th') ? 'เมื่อรับรถ' : 
                (L=='zh') ? '取车时' : 'When picking up the car', 

AdvPaymentType: (L=='th') ? 'ประเภทการชำระเงินล่วงหน้า' : (L=='zh') ? '预付款类型' : 'Advance payment type', 
Percent:        (L=='th') ? 'เปอร์เซ็นต์' : (L=='zh') ? '百分' : 'Percent', 
Amount:         (L=='th') ? 'จำนวน' : (L=='zh') ? '数量' : 'Amount', 

AdvPaymentDeposit:  (L=='th') ? 'จำนวนการชำระเงินล่วงหน้าของมัดจำ' : 
                    (L=='zh') ? '预付保证金金额' : 
                    'Amount of advance payment of deposit', 
AdvPaymentPrice:    (L=='th') ? 'จำนวนการชำระเงินล่วงหน้าของค่าเช่า' : 
                    (L=='zh') ? '预付租金金额' : 
                    'Amount of advance payment of rent', 
IsCheckIn:      (L=='th') ? 'เช็คอิน' : (L=='zh') ? '报到' : 'Check in', 

PleasePay:      (L=='th') ? 'กรุณาชำระเงิน' : 
                (L=='zh') ? '请付款' : 'Please pay', 
BeforeTime:     (L=='th') ? 'ก่อนเวลา' : 
                (L=='zh') ? '之前的时间' : 'before time', 

Payment:        (L=='th') ? 'ชำระเงิน' : 
                (L=='zh') ? '付款' : 'Make payment', 

PROC_ORDER_1:   (L=='th') ? 'คุณมีรายการเช่ารถที่กำลังดำเนินการ' : (L=='zh') ? '您正在进行一项汽车租赁交易。' : 
                'You have a car rental transaction in progress.', 
PROC_ORDER_2:   (L=='th') ? 'หรือ ถ้าต้องการเช่าใหม่ กรุณากดปุ่ม ยกเลิก' : (L=='zh') ? '或者如果您想再次租赁，请按取消按钮。' : 
                'Or if you want to rent again, please press the cancel button.', 

PlsTakeAction:  (L=='th') ? 'กรุณาดำเนินการ' : 
                (L=='zh') ? '请采取行动。' : 'Please take action.', 
PlsWait:        (L=='th') ? 'กรุณารอ' : 
                (L=='zh') ? '请稍等。' : 'Please wait.', 

Channel:        (L=='th') ? 'ช่องทาง' : (L=='zh') ? '渠道' : 'Channel', 
FeePercent:     (L=='th') ? '% ค่าธรรมเนียม' : (L=='zh') ? '费用 ％' : 'Fee %', 
Mode:           (L=='th') ? 'Mode' : (L=='zh') ? '模式' : 'Mode', 
Test:           (L=='th') ? 'ทดสอบ' : (L=='zh') ? '测试' : 'Test', 
Live:           (L=='th') ? 'ใช้งานจริง' : (L=='zh') ? '实际使用' : 'Actually use', 

IDMustUnique:       (L=='th') ? 'ID ต้องไม่ซ้ำกับที่มีอยู่' : (L=='zh') ? '该 ID 必须与现有 ID 不同。' : 
                    'ID must be unique from an existing ID.', 

IDMustNotSpaces:    (L=='th') ? 'ID ต้องไม่มีช่องว่าง' : (L=='zh') ? 'ID 不得包含空格。' : 
                    'ID must not contain spaces.', 

IDMustAlphanumeric: (L=='th') ? 'ID ต้องประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวเลข ขีดกลาง หรือขีดล่าง เท่านั้น' : 
                    (L=='zh') ? 'ID 只能包含英文字母、数字、破折号或下划线。' : 
                    'ID must contain only English letters, numbers, dashes or underscores.', 

BranchAdmin:    (L=='th') ? 'แอดมินสาขา'  : (L=='zh') ? '分行管理员' : 'Branch admin',
OrderAdmin:     (L=='th') ? 'แอดมินออเดอร์' : (L=='zh') ? '行政命令' : 'Order admin', 
Driver:         (L=='th') ? 'พนักงานขับรถ' : (L=='zh') ? '' : 'Driver', 

Language:       (L=='th') ? 'ภาษา' : (L=='zh') ? '语言' : 'Language', 

NotPlace:       (L=='th') ? 'ไม่ใช่สถานที่' : (L=='zh') ? '没有地方' : 'Not place', 
CustomerPlace:  (L=='th') ? 'สถานที่ของลูกค้า' : (L=='zh') ? '顾客处' : 'Customer place', 
CustomerPickupPlace:  (L=='th') ? 'สถานที่ลูกค้ารับรถ' : (L=='zh') ? '客户提车地点' : 'Customer pickup place', 
CustomerReturnPlace:  (L=='th') ? 'สถานที่ลูกค้าคืนรถ' : (L=='zh') ? '顾客还车的地方' : 'Customer return place', 

Number:         (L=='th') ? 'หมายเลข' : (L=='zh') ? '数字' : 'Number', 

File:           (L=='th') ? 'ไฟล์' : (L=='zh') ? '文件' : 'File', 

Remain:         (L=='th') ? 'คงเหลือ' : (L=='zh') ? '其余的' : 'Remain', 
Transactions:   (L=='th') ? 'รายการ' : (L=='zh') ? '列表' : 'transactions', 
Created:        (L=='th') ? 'สร้างแล้ว' : (L=='zh') ? '已创建' : 'Already created', 

Token:          (L=='th') ? 'Token' : (L=='zh') ? 'Token' : 'Token', 

FromDate:       (L=='th') ? 'จากวันที่' : (L=='zh') ? '从日期' : 'From date', 
ToDate:         (L=='th') ? 'ถึงวันที่' : (L=='zh') ? '最新' : 'To date', 
// OrderBy:        (L=='th') ? 'เรียงลำดับตาม' : (L=='zh') ? '排序方式' : 'Order by', 
// OrderByCode:    (L=='th') ? 'รหัส ใหม่->เก่า' : (L=='zh') ? '代码新->旧' : 'Code new->old', 
// OrderByPickupDate: (L=='th') ? 'วันที่รับรถ เร็ว->ช้า' : (L=='zh') ? '取货日期：早 -> 晚': 'Pickup date early->late', 

Code:           (L=='th') ? 'รหัส' : (L=='zh') ? '代码' : 'Code', 
// PickupDateTime: (L=='th') ? 'วันเวลารับรถ' : (L=='zh') ? '取件日期时间' : 'Pickup date time', 
// ReturnDateTime: (L=='th') ? 'วันเวลาคืนรถ' : (L=='zh') ? '还车日期和时间' : 'Return date time', 
RentalInterval: (L=='th') ? 'ระยะเวลาเช่า' : (L=='zh') ? '租赁期限' : 'Rental tnterval', 

MoreInfo:       (L=='th') ? 'ข้อมูลเพิ่มเติม' : (L=='zh') ? '更多信息' : 'More info', 

Rent:           (L=='th') ? 'เช่ารถ' : (L=='zh') ? '租车' : 'Rant car', 


MinimumAmount:  (L=='th') ? 'ยอดซื้อขั้นต่ำ' : (L=='zh') ? '最低购买金额' : 'Minimum purchase amount', 
DiscountType:   (L=='th') ? 'ประเภทส่วนลด' : (L=='zh') ? '折扣类型' : 'Discount type',
DiscountAmount: (L=='th') ? 'จำนวนส่วนลด' : (L=='zh') ? '折扣金额' : 'Discount amount',
MaximumDiscount:(L=='th') ? 'ส่วนลดสูงสุด' : (L=='zh') ? '最大折扣' : 'Maximum discount', 
NumberOfCoupon: (L=='th') ? 'จำนวนคูปอง' : (L=='zh') ? '优惠券数量' : 'Number of coupon', 
UsageTimes:     (L=='th') ? 'จำนวนครั้งที่ใช้ได้' : (L=='zh') ? '可使用次数' : 'Number of times that can be used', 
NumberOfDigit:  (L=='th') ? 'จำนวนตัวอักษร' : (L=='zh') ? '字符数' : 'Number of characters', 
IncludedNumeric: (L=='th') ? 'มีตัวเลข' : (L=='zh') ? '有数字' : 'Have numbers', 
IncludedUpperCase:  (L=='th') ? 'มีตัวพิมพ์ใหญ่' : (L=='zh') ? '带有大写字母' : 'Have upper case', 
IncludedLowerCase:  (L=='th') ? 'มีตัวพิมพ์เล็ก' : (L=='zh') ? '带小写字母' : 'Have lower case', 

PLS_CHECK_OUT:  (L=='th') ? 'เมื่อเลิกงาน กรุณาพิมพ์คำว่า Check out หรือพิมพ์ตัว M แล้วกดปุ่ม Check out' : 
                (L=='zh') ? '在一天结束时，请输入单词“结账”或输入 M 并按“结账”按钮。' : 
                            'At the end of day, please type the word Check out or type M and press button Check out.', 
PLS_CHECK_IN:   (L=='th') ? 'เมื่อเริ่มงาน กรุณาพิมพ์คำว่า Check in หรือพิมพ์ตัว M แล้วกดปุ่ม Check in' : 
                (L=='zh') ? '在一天开始时，请输入单词“签入”或键入 M 并按“签入”按钮。' : 
                            'At the begin of day, please type the word Check in  or type M and press button Check in.', 

SelectDriver:   (L=='th') ? 'เลือกพนักงานขับรถ' : (L=='zh') ? '选择司机' : 'Select a driver', 
CarNumber:      (L=='th') ? 'รถคันที่ ' : (L=='zh') ? '那辆车' : 'Car number', 
CarDutyList:    (L=='th') ? 'รายการรับ/ส่งรถ' : (L=='zh') ? '取车/还车清单' : 'Car pickup/return list', 
CarDeliveryList:(L=='th') ? 'รายการส่งรถให้ลูกค้า' : (L=='zh') ? 'Car delivery list to customers' : '给客户的汽车交付清单', 
CarReturnList:  (L=='th') ? 'รายการรับคืนรถจากลูกค้า' : (L=='zh') ? 'List of car returns from customers' : '客户还车清单', 
Acknowledge:    (L=='th') ? 'รับทราบ' : (L=='zh') ? '承认' : 'Acknowledge', 
NonAcknowledge: (L=='th') ? 'ยังไม่รับทราบ' : (L=='zh') ? '尚未确认' : 'Not yet acknowledged', 
CarDeliveryDone:(L=='th') ? 'ส่งรถให้ลูกค้าแล้ว' : (L=='zh') ? '车子已经交付给客户了。' : 'Car Delivery Done', 
CarReturnDone:  (L=='th') ? 'รับคืนรถจากลูกค้าแล้ว' : (L=='zh') ? '车已从客户处归还。' : 'Car Return Done', 
CustomerPickupCar: (L=='th') ? 'ลูกค้ามารับรถ' : (L=='zh') ? '客户前来提车。' : 'Customer pick up car', 
CustomerReturnCar: (L=='th') ? 'ลูกค้านำรถมาคืน' : (L=='zh') ? '客户归还车辆。' : 'Customer return the car', 

DeSelectDriver: (L=='th') ? 'ยกเลิกการเลือกพนักงานขับรถ' : (L=='zh') ? '取消选择驱动程序' : 'Deselect Driver', 
ConfirmDeSelectDriver: (L=='th') ? 'ยืนยันยกเลิกการเลือกพนักงานขับรถ' : (L=='zh') ? '确认取消司机选择' : 'Confirm cancellation of driver selection', 
Warning:        (L=='th') ? 'เตือน' : (L=='zh') ? '警告' : 'Warning', 

ChangeList:     (L=='th') ? 'รายการเปลี่ยนแปลง' : (L=='zh') ? '更改列表' : 'Change list', 
DateTime:       (L=='th') ? 'วันเวลา' : (L=='zh') ? '日期和时间' : 'Date and time', 
By:             (L=='th') ? 'โดย' : (L=='zh') ? '经过' : 'By', 

OpenRentalCarShop: (L=='th') ? 'เปิดร้านเช่ารถ' : (L=='zh') ? '开一家汽车租赁店' : 'Open a car rental shop', 
ShopName:          (L=='th') ? 'ชื่อร้าน' : (L=='zh') ? '店铺名称' : 'Shop name', 
AdminName:         (L=='th') ? 'ชื่อแอดมิน' : (L=='zh') ? '管理员名称' : 'Admin name', 

MonthlyType:       (L=='th') ? 'แบบรายเดือน' : (L=='zh') ? '包月型' : 'Monthly type', 
PrepaidType:       (L=='th') ? 'แบบเติมเงิน' : (L=='zh') ? '预付费' : 'Prepaid type', 

Package:           (L=='th') ? 'แพ็กเก็จ' : (L=='zh') ? '包裹' : 'Package', 
FreeFirstMonth:    (L=='th') ? 'ฟรีเดือนแรก' : (L=='zh') ? '第一个月免费' : 'Free first month', 
FreeFirst3Month:   (L=='th') ? 'พิเศษช่วงแนะนำ 10 ร้านแรก ฟรี 3 เดือนแรก' : (L=='zh') ? '特别促销期：前10家商店前3个月免费' : 
                               'Special introductory period: first 10 shops free for first 3 months', 
FreeFirstTime:     (L=='th') ? 'ฟรีคร้้งแรก' : (L=='zh') ? '第一次免费' : 'Free first time', 
Choose:            (L=='th') ? 'เลือก' : (L=='zh') ? '选择' : 'Choose', 
OpenRentalCarShopSuccess: (L=='th') ? 'เปิดร้านเช่ารถสำเร็จแล้ว' : (L=='zh') ? '一家汽车租赁店已成功开业。' : 'Open car rental shop successful', 
SignIn2Systen:     (L=='th') ? 'Sign in เข้าสู่ระบบ' : (L=='zh') ? '登录系统' : 'Sign in to system', 

CustomerField:  (L=='th') ? 'ฟิลด์ลูกค้า' : (L=='zh') ? '客户领域' : 'Customer field ', 
Mandate:        (L=='th') ? 'บังคับ' : (L=='zh') ? '授权' : 'Mandate', 

CheckInDone:    (L=='th') ? 'เช็คอินแล้ว' : (L=='zh') ? '签到完成' : 'Check in done', 
CheckOutDone:   (L=='th') ? 'เช็คเอ๊าท์แล้ว' : (L=='zh') ? '签出完成' : 'Check out done', 

PREFIX_CODE:    (L=='th') ? 'อักษรนำ' : (L=='zh') ? '前缀码' : 'Prefix code', 
FOLLOW_WITH:    (L=='th') ? 'ตามด้วย' : (L=='zh') ? '跟随' : 'follow with', 
MONTH_2_DIGIT:  (L=='th') ? 'เดือน 2 หลัก' : (L=='zh') ? '月份 2 位数字' : 'Month 2 digits', 

YearAD:         (L=='th') ? 'ปี ค.ศ.' : (L=='zh') ? '年' : 'AD year', 
YearBE:         (L=='th') ? 'ปี พ.ศ.' : (L=='zh') ? '年' : 'BE year', 
Digit:          (L=='th') ? 'หลัก' : (L=='zh') ? '数字' : 'digits', 
NumberSequence: (L=='th') ? 'เลขลำดับ' : (L=='zh') ? '序列号' : 'Sequence number', 
NumberRandom:   (L=='th') ? 'เลขสุ่ม' : (L=='zh') ? '序列号' : 'Random number', 

ChillPay:       (L=='th') ? 'ชำระเงินออนไลน์ ด้วยบัตรเครดิต โอนเงิน (QR code) และอื่น ๆ' : 
                (L=='zh') ? '在线支付通过信用卡、汇款（二维码）等方式' : 
                            'Pay online by credit card, money transfer (QR code), etc.', 
ChillPayMore:   (L=='th') ? 'ดูช่องทางต่างๆ ในการชำระเงินของ ChillPay' : 
                (L=='zh') ? '查看各种频道在 ChillPay 付款中' : 'See various channels in ChillPay payments', 
ChillPayTest:   (L=='th') ? 'ทดสอบระบบ ชำระเงิน 20 บาท' : (L=='zh') ? '' : '', 
PayOnline:      (L=='th') ? 'ชำระเงินออนไลน์' : (L=='zh') ? '测试系统，支付20泰铢' : 'Test the system, pay 20 baht', 

PaymentFee:     (L=='th') ? 'ค่าธรรมเนียม' : (L=='zh') ? '费用' : 'Fee', 
MakePayment:    (L=='th') ? 'ชำระเงิน' : (L=='zh') ? '' : 'Make payment', 

MoneyTransfer:  (L=='th') ? 'โอนเงินเข้าบัญชีธนาคาร' : (L=='zh') ? '将钱转入银行账户' : 'Transfer money to bank account', 
MTPicture:      (L=='th') ? 'รูปหลักฐานการโอนเงิน' : (L=='zh') ? '汇款凭证图片' : 'Picture of evidence of money transfer', 

ConfirmPayment: (L=='th') ? 'ยืนยันการชำระเงิน' : (L=='zh') ? '确认付款' : 'Confirm payment', 
DeniedPayment:  (L=='th') ? 'ปฏิเสธการชำระเงิน' : (L=='zh') ? '付款被拒绝' : 'Denied payment', 

Default:        (L=='th') ? 'ค่าเริ่มต้น' : (L=='zh') ? '默认' : 'Default', 

DayOrMorePerDay:    (L=='th') ? 'วันขึ้นไป วันละ' : (L=='zh') ? '天或以上, 一天' : 'days or more, per day',
WeekOrMorePerWeek:  (L=='th') ? 'สัปดาห์ขึ้นไป สัปดาห์ละ' : (L=='zh') ? '周或更长时间，一周' : 'weeks or more, per week',
MonthOrMorePerMonth:(L=='th') ? 'เดือนขึ้นไป เดือนละ' : (L=='zh') ? '个月或以上，每月' : 'months or more, per month',
YearOrMorePerYear:  (L=='th') ? 'ปีขึ้นไป ปีละ' : (L=='zh') ? '年复一年' : 'years or more, per year',

CheckInDate:        (L=='th') ? 'วันที่เช็คอิน' : (L=='zh') ? '入住日期' : 'Check-in date', 
CheckOutDate:       (L=='th') ? 'วันที่เช็คเอาท์' : (L=='zh') ? '离开日期' : 'Check-out date', 

RoomType:               (L=='th') ? 'ประเภทห้อง' : (L=='en') ? 'Room type' : '房型',
RoomCharge:             (L=='th') ? 'ค่าห้อง' : (L=='en') ? 'Room charge' : '换房间',
RoomChargeDay:          (L=='th') ? 'ค่าห้องวันที่' : (L=='en') ? 'Room charge for date' : '房费日期',
TotalRoomCharge:        (L=='th') ? 'รวมค่าห้อง' : (L=='en') ? 'Total room charge' : '总房费',
TotalRoomOptionAmount:  (L=='th') ? 'รวมค่าห้อง + ออฟชั่น' : (L=='en') ? 'Total room charge + option amount' : '包含房价+选项',

TotalPerRoom:   (L=='th') ? 'รวมต่อห้อง' : (L=='en') ? 'Total per room' : '每间客房总计',
TotalAllRoom:   (L=='th') ? 'รวมทุกห้อง' : (L=='en') ? 'Total all room' : '包括所有房间',
RoomUnit:       (L=='th') ? 'ห้อง' : (L=='zh') ? '房间' : 'Room(s)', 
RoomNumber:     (L=='th') ? 'ห้องที่' : (L=='zh') ? '号房' : 'Room number', 

AcceptTerms:    (L=='th') ? 'ยอมรับเงื่อนไข' : (L=='en') ? 'Accept terms' : '我接受这些条款。',

BookingOrder:    (L=='th') ? 'รายการจอง' : (L=='en') ? 'Booking Order' : '预订清单',

BookingOrderCode:(L=='th') ? 'รหัสรายการจอง' : (L=='en') ? 'Booking Order Code' : '预约码',

HR_SelectType:  (L=='th') ? 'ลูกค้าเลือกประเภทห้อง' : (L=='zh') ? '顾客选择房型' : 'Customer selects room type',

HR_Wait4CustomerLocation: (L=='th') ? 'รอลูกค้าส่ง location' : (L=='zh') ? '等待客户发送位置' : 
                          'Waiting for the customer to send location',

HR_Wait4Approval: (L=='th') ? 'รออนุมัติรายการจอง' : (L=='zh') ? '等待预订名单批准' : 'Waiting for booking approval',

HR_Approved:    (L=='th') ? 'อนุมัติรายการจอง' : (L=='zh') ? '批准预订清单' : 'Approve booking transaction',

HR_NotApproved: (L=='th') ? 'ไม่อนุมัติรายการจอง' : (L=='zh') ? '预订项目未获批准' : 'Car rental transaction not approved',

HR_Wait4AdvancePayment: (L=='th') ? 'รอการชำระเงินล่วงหน้า' : (L=='zh') ? '等待预付款' : 'Waiting for advance payment',

HR_ExpireCustomerLocation: (L=='th') ? 'ยกเลิก เนื่องจากลูกค้าไม่ส่ง location' : (L=='zh') ? '由于客户未发送位置而取消。' : 
                "Canceled because the customer didn't send the location.",

HR_ExpireAdvancePayment: (L=='th') ? 'ยกเลิก เนื่องจากลูกค้าไม่ชำระเงินล่วงหน้า' : (L=='zh') ? '由于客户没有提前付款而取消。' : 
                         "Canceled because the customer didn't pay in advance.",

HR_CancelByCustomer: (L=='th') ? 'ยกเลิกโดยลูกค้า' : (L=='zh') ? '客户取消' : 'Cancellation by customer', 

HR_CancelByAdmin:    (L=='th') ? 'ยกเลิกโดยแอดมิน' : (L=='zh') ? '已被管理员取消' : 'Cancelled by admin', 

HR_Confirm:          (L=='th') ? 'ยืนยันรายการจอง' : (L=='zh') ? '确认预订' : 'Confirm booking transaction',

HR_InformPayment:       (L=='th') ? 'แจ้งชำระเงิน' : (L=='zh') ? '付款通知' : 'Notification of payment', 


HR_Wait4SelectDriver:   (L=='th') ? 'รอเลือกพนักงานขับรถ' : (L=='zh') ? '等待选择驱动程序' : 'Waiting to select a driver', 

HR_DriverSelected:      (L=='th') ? 'เลือกพนักงานขับรถแล้ว' : (L=='zh') ? '已选择司机' : 'Driver selected', 

HR_Wait4Driver2Pickup:  (L=='th') ? 'รอพนักงานขับรถไปรับลูกค้า' : (L=='zh') ? '等待司机来接顾客。' : 'Waiting for the driver to pick up the customer', 

HR_Wait4CustomerCheckIn: (L=='th') ? 'รอลูกค้าเช็คอิน' : (L=='zh') ? '等待顾客入住' : 'Waiting for the customer to check in', 

HR_CustomerStay:        (L=='th') ? 'ลูกค้าเข้าพัก' : (L=='zh') ? '入住顾客' : 'Customer stay', 

// HR_Wait4CustomerCheckOut: (L=='th') ? 'รอลูกค้าเช็คเอาท์' : (L=='zh') ? '等待顾客结帐' : 'Waiting for the customer to check out', 

HR_CustomerCheckedOut:  (L=='th') ? 'ลูกค้าเช็คเอาท์แล้ว' : (L=='zh') ? '顾客已结账。' : 'The customer has checked out.', 

HR_Wait4Driver2Deliver: (L=='th') ? 'รอพนักงานขับรถไปส่งลูกค้า' : (L=='zh') ? '等待司机送顾客' : 'Wait for the driver to deliver the customer.', 

HR_DriverDropOffCustomer: (L=='th') ? 'พนักงานขับรถไปส่งลูกค้าแล้ว' : (L=='zh') ? '随后司机送顾客下车。' : 'The driver then dropped off the customer.', 

CustomerCheckIn:         (L=='th') ? 'ลูกค้าเช็คอิน' : (L=='zh') ? '顾客签到' : 'Customer check in', 

CustomerCheckOut:        (L=='th') ? 'ลูกค้าเช็คเอาท์' : (L=='zh') ? '顾客结账' : 'Customer check out', 

CheckOut:                (L=='th') ? 'เช็คเอาท์' : (L=='zh') ? '查看' : 'Check out', 

HR_PlsWaitApproval:     (L=='th') ? 'กรุณารออนุมัติรายการจอง' : (L=='zh') ? '请等待租车批准。' : 'Please wait for booking approval.',

PayUponCheckIn:         (L=='th') ? 'จ่ายเมื่อเช็คอิน' : (L=='zh') ? '入住时付款' : 'Pay upon check-in', 

Stay:           (L=='th') ? 'เข้าพัก' : (L=='zh') ? '停留' : 'Stay', 
StayInterval:   (L=='th') ? 'ระยะเวลาเข้าพัก' : (L=='zh') ? '停留时间' : 'Stay interval', 

Other:          (L=='th') ? 'อื่น ๆ' : (L=='zh') ? '其他' : 'Other', 

BookingTable:   (L=='th') ? 'ตารางการจอง' : (L=='en') ? 'Booking Table' : '预约时间表',

RentalCarTable: (L=='th') ? 'ตารางเช่ารถ' : (L=='zh') ? '汽车租赁时间表' : 'Rental Car Table', 

ChangeCar:      (L=='th') ? 'เปลี่ยนรถ' : (L=='zh') ? '换车' : 'Change car', 
ChangeRoom:     (L=='th') ? 'เปลี่ยนห้อง' : (L=='zh') ? '换房间' : 'Change room', 
*/

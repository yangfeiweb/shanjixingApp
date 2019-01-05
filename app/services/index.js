import auth from "./pageService/auth";
import learn from "./pageService/learn";
import personal from "./pageService/personal";
import course from "./pageService/course";
import common from "./pageService/common";
export default Object.assign({}, auth, learn, personal, course, common);

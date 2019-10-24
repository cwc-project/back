// let cwc;

// export default class CwcDAO {
//   static async injectDB(client) {
//     if (cwc) return;
//     try {
//       cwc = await client.db(process.env.DB_NAME);
//       // console.log('CWC', cwc);
//     } catch (e) {
//       // eslint-disable-next-line no-console
//       console.error(`Unable to establish collection handles in cwcDAO: ${e}`);
//     }
//   }

//   static async getConfiguration() {
//     const roleInfo = await cwc.command({ connectionStatus: 1 })
//     const authInfo = roleInfo.authInfo.authenticatedUserRoles[0]
//     // const { poolSize, wtimeout } = movies.s.db.serverConfig.s.options
//     let response = {
//       // poolSize,
//       // wtimeout,
//       authInfo,
//     }
//     return response
//   }
// }

// // (async function test () {
// //   // const roleInfo = await cwc;
// //   setTimeout(async () => {
// //     const roleInfo = await cwc.command({ connectionStatus: 1 })
// //     console.log(roleInfo)
// //   }, 4000);
// // // console.log(roleInfo)
// // })();

// module.exports = CwcDAO;

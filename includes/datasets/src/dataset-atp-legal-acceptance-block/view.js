/**
 * WordPress Dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { apiFetch } = window.wp;

const ATP_TEXT = `
This is a legal agreement (this “Agreement”) between you, the end user (“you” or “User”), and Pew Research Center (the “Center”). By downloading the American Trends Panel survey data made available on this web site (“Data”) you are agreeing to be bound by the terms and conditions of this Agreement. If you do not agree to be bound by these terms, do not download or use the Data.

I.	License.
A.	 The Center hereby grants User a non-exclusive, revocable, limited, non-sublicensable, non-transferable, worldwide, royalty-free license to use the Data solely for (1) research, scholarly or academic purposes, or (2) User’s own personal, non-commercial use. The foregoing license is personal to User, and you may not share (or otherwise permit access to) the Data to any other individual or entity, including those within your business or organization.  Further, you may not reproduce, sell, rent, lease, loan, distribute or sublicense, or otherwise transfer any Data, in whole or in part, to any other party, or use the Data to create any derivative work or product for resale, lease or license. Notwithstanding the foregoing, you may incorporate limited portions of the Data in scholarly, research or academic publications or for the purposes of news reporting provided that you:
1.	 acknowledge the source of the Data with express reference to the Center in accordance with the following citation:

“Pew Research Center’s American Trends Panel”

2.	do not use the Data in any manner that implies, suggests, or could otherwise be perceived as attributing a particular policy or lobbying objective or opinion to the Center, and
3.	include the following disclaimer: “The opinions expressed herein, including any implications for policy, are those of the author and not of Pew Research Center.”
B.	User acknowledges that, as between the parties, the Center is the sole and exclusive owner of all right, title and interest in the Data.  Except for the limited license granted herein, this Agreement does not give User any right, title or interest in the Data.

II.	Disclaimers and Limitations of Liability. THE DATA IS PROVIDED “AS IS” WITHOUT ANY WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, ARISING BY LAW OR OTHERWISE, INCLUDING BUT NOT LIMITED TO WARRANTIES OF COMPLETENESS, NON-INFRINGEMENT, ACCURACY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. THE CENTER EXPRESSLY DISCLAIMS, AND SHALL HAVE NO LIABILITY FOR, ANY ERRORS, OMISSIONS, INACCURACIES, OR INTERRUPTIONS IN THE DATA.  USER ASSUMES ALL RISK ASSOCIATED WITH USE OF THE DATA AND AGREES THAT IN NO EVENT SHALL THE CENTER OR ITS AFFILIATES BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR THE INABILITY TO USE EQUIPMENT OR ACCESS DATA, LOSS OF BUSINESS, LOSS OF REVENUE OR PROFITS, BUSINESS INTERRUPTIONS, LOSS OF INFORMATION OR DATA, OR OTHER FINANCIAL LOSS, ARISING OUT OF THE USE OF, OR INABILITY TO USE, THE DATA BASED ON ANY THEORY OF LIABILITY INCLUDING, BUT NOT LIMITED TO, BREACH OF CONTRACT, BREACH OF WARRANTY, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, EVEN IF USER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

III.	Privacy, Confidentiality and Security.
A.	The Center respects the privacy of individuals. The Center has taken measures to ensure that the Data is devoid of information that could be used to identify individuals (including, but not limited to, names, telephone numbers and email addresses) who participated in or who were the subject of any research surveys or studies used to collect the Data (“Personally Identifying Information”). However, in the event that you discover any such Personally Identifying Information in the Data, you shall immediately notify the Center and refrain from using any such Personally Identifying Information. User further agrees not to (and will not allow other to) attempt to ascertain the identity of or derive information about individual survey respondents nor link the individual survey records contained in the Data with other data sets for the purpose of identifying individuals.
B.	User shall maintain the Data as confidential, and will not use it, in any way nor disclose it to any third party, except as expressly permitted under this Agreement. User agrees, at its sole expense, to take reasonable precautions to protect the confidentiality of Data, at least as stringent as User takes to protect User’s own confidential information, but in no case less than reasonable care.  The foregoing confidentiality obligations shall not apply to any information which: (a) is known to User prior to receipt from the Center other than as a result of User’s breach of any legal obligation; (b) becomes known (independently of disclosure by the Center) to User directly or indirectly from a source having the legal right to disclose such information; (c) is or becomes publicly known, except through a breach of this Agreement by User; or (d) is required to be disclosed by User to comply with applicable laws or governmental regulations, provided that User gives the Center, to the extent practicable, reasonable prior written notice of such disclosure sufficient to permit the Center to contest such disclosure and User takes reasonable and lawful actions to avoid and/or minimize the extent of such disclosure.  The parties agree that any breach of the confidentiality obligations of this Agreement by User will result in irreparable damage to the Center for which it will have no adequate remedy at law.  Therefore, it is agreed that the Center shall be entitled to equitable relief, including an injunction enjoining any such breach by any court of competent jurisdiction.  Such injunction shall be without prejudice to any other right or remedy to which the Center may be entitled, including but not limited to any damages resulting from User’s breach of the confidentiality obligations under this Agreement.  Any failure or delay in exercising any right, power or privilege hereunder shall not operate as a waiver thereof, nor shall any single or partial exercise thereof preclude any other or further exercise thereof or the exercise of any right, power or privilege hereunder.
C.	User will immediately notify the Center and cooperate with investigations, and provide any information reasonably requested by the Center if User knows of or suspects any breach of security or potential vulnerability of the Data and will promptly remedy such breach.

IV.	Indemnification. User shall indemnify and hold harmless the Center, its affiliates and related organizations, and each of their respective officers, directors, employees, legal representatives, agents, successors and assigns, from and against any damages, liabilities, costs and expenses (including reasonable attorneys’ and professionals’ fees and court costs arising out of any third-party claims based on (a) User’s access or use of the Data; (b) any changes made by User to the Data in accordance with this Agreement; or (c) any breach by User of any of the terms and conditions of this Agreement.

V.	Termination. This license will terminate (1) automatically without notice from the Center if you fail to comply with the provisions of this Agreement or (2) immediately upon written notice (by e-mail or otherwise) from the Center. Upon termination of this Agreement, you agree to destroy all copies of any Data, in whole or in part and in any and all media, in your custody and control.

VI.	Governing law. This Agreement shall be governed by, construed and interpreted in accordance with the laws of the District of Columbia. You further agree to submit to the jurisdiction and venue of the courts of the District of Columbia for any dispute relating to this Agreement.
`;

/**
 * This block is an addon to the dataset download block, as such it adds functionality on to the prc-platform/dataset-download store.
 */
const { actions } = store('prc-platform/dataset-download', {
	state: {
		atpLegalText: ATP_TEXT,
	},
	actions: {
		*closeModal() {
			const popupController = yield store('prc-block/popup-controller');
			const { actions: popupActions } = popupController;
			popupActions.closeAll();
		},
		*accept() {
			const context = getContext();
			const { datasetId, NONCE } = context;

			const contentGateStore = store('prc-user-accounts/content-gate');
			const contentGateState = contentGateStore.state;

			const { token, uid } = contentGateState;
			yield apiFetch({
				path: `/prc-api/v3/datasets/accept-atp`,
				method: 'POST',
				data: {
					uid,
					userToken: token,
					NONCE,
				},
			})
				.then((response) => {
					actions.downloadDataset(datasetId, uid, token, NONCE, context);
					actions.closeModal();
				})
				.catch((error) => {

					actions.closeModal();
				});
		},
		*cancel() {
			actions.closeModal();
		},
	},
});

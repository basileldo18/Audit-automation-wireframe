(function () {
      var params = new URLSearchParams(window.location.search);
      var flow = params.get('flow');
      var data = params.get('data');
      if (flow === 'documents_submitted' || data === 'received') {
        // Inject CSS before any element paints
        var style = document.createElement('style');
        style.id = 'portal-return-blocker';
        style.textContent = [
          '#intro-overlay { display: none !important; }',
          '.overlay-container { display: none !important; }',
          '.cinematic-overlay { display: none !important; }',
          '#interstitial { display: none !important; }',
          '#client-reject-overlay { display: none !important; }',
          '#delivery-overlay { display: none !important; }',
          '#onboarding-dispatch-overlay { display: none !important; }',
          '#manager-review-overlay { display: none !important; }',
          '#client-handover-overlay { display: none !important; }',
          '#dashboard { display: grid !important; opacity: 1 !important; }'
        ].join(' ');
        document.head.appendChild(style);
      }
    })();

async function simulateTyping(fieldId, text, speed = 15) {
      const field = document.getElementById(fieldId);
      field.classList.add('typing-active');
      field.value = "";

      let cursorEl = document.createElement('span');
      cursorEl.className = 'typing-cursor';
      field.parentElement.appendChild(cursorEl);

      for (let i = 0; i < text.length; i++) {
        field.value += text.charAt(i);
        const jitter = Math.random() * (speed * 0.5);
        await new Promise(r => setTimeout(r, speed + jitter));
      }
      await new Promise(r => setTimeout(r, 100));
      cursorEl.remove();
      field.classList.remove('typing-active');
    }

    async function startAutoFill() {
      await new Promise(r => document.getElementById('fieldName').addEventListener('click', r, { once: true }));
      await simulateTyping('fieldName', 'Audit offshore');

      await new Promise(r => document.getElementById('fieldCompany').addEventListener('click', r, { once: true }));
      await simulateTyping('fieldCompany', 'Audit Offshore Ltd.');

      await new Promise(r => document.getElementById('fieldEmail').addEventListener('click', r, { once: true }));
      await simulateTyping('fieldEmail', 'info@auditoffshore.com');

      await new Promise(r => document.getElementById('fieldPhone').addEventListener('click', r, { once: true }));
      await simulateTyping('fieldPhone', '+1 (800) 555-1234');
    }

    async function executeFlow() {
      // Immediately start transition — zero artificial delay
      const intro = document.getElementById('intro-overlay');
      const btn = document.getElementById('submitBtn');

      btn.classList.add('loading');
      btn.disabled = true;

      // Immediately show cinematic black interstitial ON TOP of the white intro form
      // (interstitial z-index is 3000, intro is 100)
      const interstitial = document.getElementById('interstitial');
      interstitial.style.display = 'flex';
      
      // Force repaint to ensure CSS transition works smoothly
      void interstitial.offsetWidth;
      interstitial.classList.add('show');

      // Do NOT fade out intro-overlay, it acts as a solid white blocker until the black interstitial is fully opaque.
      // Wait for interstitial fade-in (0.8s) before starting text typewriter, 
      // but start it slightly earlier (e.g. 400ms) for a snappy feel.
      setTimeout(() => {
        // Now safely hide the intro form underneath
        intro.style.display = 'none';
        
        // Reveal badge immediately
        const badge = document.getElementById('interstitial-badge');
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';

        // Start progress bar 
        document.getElementById('interstitial-progress').style.width = '100%';

        // Typewriter Line 1
        const msg1 = `The system is now automatically sending an encrypted link for the Secure KYC and CDD submission forms directly to the client's email and WhatsApp.`;
        const el1 = document.getElementById('interstitial-text');
        el1.textContent = '';
        let i = 0;
        let clickReady = false;
        const type1 = setInterval(() => {
          el1.textContent += msg1[i++];
          if (i >= msg1.length) {
            clearInterval(type1);
            setTimeout(() => {
              const el2 = document.getElementById('interstitial-text-2');
              el2.style.opacity = '1';
              const msg2 = 'Simulating client clicking the link...';
              let j = 0;
              const type2 = setInterval(() => {
                el2.textContent += msg2[j++];
                if (j >= msg2.length) {
                  clearInterval(type2);
                  setTimeout(() => {
                    document.getElementById('interstitial-click-hint').style.opacity = '1';
                    interstitial.style.cursor = 'pointer';
                    clickReady = true;
                  }, 200);
                }
              }, 45);
            }, 300);
          }
        }, 24);

        const advanceToKYC = () => {
          if (!clickReady) return;
          interstitial.removeEventListener('click', advanceToKYC);
          interstitial.style.cursor = 'default';
          interstitial.classList.remove('show');
          setTimeout(() => {
            interstitial.style.display = 'none';
            runClientKYC();
          }, 400); // Wait for fade out of interstitial
        };
        interstitial.addEventListener('click', advanceToKYC);

      }, 500); // 500ms allows the black overlay to become mostly opaque before starting text
    }

    async function runClientKYC() {
      const kycLayer = document.getElementById('kyc-overlay');
      kycLayer.classList.remove('hidden');
      kycLayer.classList.add('fade-in');

      await new Promise(r => setTimeout(r, 800));

      // Step 1: Wait for individual clicks
      await new Promise(r => document.getElementById('k_entity').addEventListener('click', r, { once: true }));
      await simulateTyping('k_entity', 'Private Limited Company (LLC)');

      await new Promise(r => document.getElementById('k_country').addEventListener('click', r, { once: true }));
      await simulateTyping('k_country', 'United Kingdom');

      await new Promise(r => document.getElementById('k_reg').addEventListener('click', r, { once: true }));
      await simulateTyping('k_reg', 'CRN-884920');

      await new Promise(r => setTimeout(r, 500));
      document.getElementById('k-step-1').classList.add('fade-out');

      setTimeout(() => {
        document.getElementById('k-step-1').style.display = 'none';
        document.getElementById('k-step-2').style.display = 'block';
        document.getElementById('k-step-2').classList.add('fade-in');
        document.getElementById('dot1').classList.remove('active');
        document.getElementById('dot2').classList.add('active');
      }, 500);

      await new Promise(r => setTimeout(r, 800));

      // Step 2: Wait for individual clicks
      await new Promise(r => document.getElementById('k_industry').addEventListener('click', r, { once: true }));
      await simulateTyping('k_industry', 'SaaS Technology / B2B Web');

      await new Promise(r => document.getElementById('k_subs').addEventListener('click', r, { once: true }));
      await simulateTyping('k_subs', 'Financial Services Tech');

      await new Promise(r => document.getElementById('k_emp').addEventListener('click', r, { once: true }));
      await simulateTyping('k_emp', '11 - 50 Employees');

      await new Promise(r => document.getElementById('k_ops').addEventListener('click', r, { once: true }));
      await simulateTyping('k_ops', 'Providing offshore digital auditing solutions.');

      await new Promise(r => setTimeout(r, 500));
      document.getElementById('k-step-2').classList.remove('fade-in');
      document.getElementById('k-step-2').classList.add('fade-out');

      setTimeout(() => {
        document.getElementById('k-step-2').style.display = 'none';
        document.getElementById('k-step-3').style.display = 'block';
        document.getElementById('k-step-3').classList.add('fade-in');
        document.getElementById('dot2').classList.remove('active');
        document.getElementById('dot3').classList.add('active');
      }, 500);

      await new Promise(r => setTimeout(r, 800));

      // Step 3: Wait for individual clicks
      await new Promise(r => document.getElementById('k_rev').addEventListener('click', r, { once: true }));
      await simulateTyping('k_rev', '£1,500,000 - £5,000,000');

      await new Promise(r => document.getElementById('k_curr').addEventListener('click', r, { once: true }));
      await simulateTyping('k_curr', 'GBP & USD');

      await new Promise(r => document.getElementById('k_bank').addEventListener('click', r, { once: true }));
      await simulateTyping('k_bank', 'Barclays Corporate');

      await new Promise(r => setTimeout(r, 500));
      const submit3 = document.getElementById('k-btn-3');
      submit3.classList.add('loading');
      await new Promise(r => setTimeout(r, 1200));

      // Show cinematic full-screen black overlay ON TOP of the KYC layer
      const successOv = document.getElementById('kyc-success-overlay');
      successOv.classList.remove('hidden');
      successOv.style.display = 'flex';
      void successOv.offsetWidth; // Force repaint
      successOv.classList.add('show');
      successOv.style.opacity = '1';

      // After cinematic overlay fades in (0.8s), safely remove the KYC layer underneath
      setTimeout(() => {
        kycLayer.style.display = 'none';

        // Start progress bar
        setTimeout(() => {
          document.getElementById('kyc-progress-bar').style.width = '100%';
        }, 100);

        // Reveal KYC badge after 400ms
        setTimeout(() => {
          const badge = document.getElementById('kyc-badge');
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';
        }, 400);

        // Typewriter — Line 1: KYC completion context
        const msg1 = 'The client has successfully completed the KYC and CDD submission. All identity verifications and corporate documents have been securely captured.';
        const el1 = document.getElementById('kyc-cinematic-text');
        el1.textContent = '';
        let i = 0;
        const type1 = setInterval(() => {
          el1.textContent += msg1[i++];
          if (i >= msg1.length) {
            clearInterval(type1);

            // Typewriter — Line 2
            setTimeout(() => {
              const el2 = document.getElementById('kyc-cinematic-text-2');
              el2.style.opacity = '1';
              const msg2 = 'Switching to Audit Manager Dashboard...';
              let j = 0;
              const type2 = setInterval(() => {
                el2.textContent += msg2[j++];
                if (j >= msg2.length) {
                  clearInterval(type2);
                  // Show click hint and enable click
                  setTimeout(() => {
                    document.getElementById('kyc-click-hint').style.opacity = '1';
                    successOv.style.cursor = 'pointer';
                    kycClickReady = true;
                  }, 400);
                }
              }, 45);
            }, 700);
          }
        }, 24);

        // After typewriter completes, show click hint and wait for click
        const advanceToDashboardFn = () => {
          successOv.style.opacity = '0';
          setTimeout(() => {
            successOv.style.display = 'none';
            successOv.classList.add('hidden');

            const dashboard = document.getElementById('dashboard');
            dashboard.classList.add('fade-in');

            setTimeout(() => {
              document.getElementById('targetRow').classList.remove('hidden');
              setTimeout(() => {
                document.getElementById('sidePanel').classList.add('open');
              }, 600);
            }, 500);
          }, 700);
        };

        let kycClickReady = false;
        // Persistent click handler — only fires when ready, removes itself after
        const advanceToDashboard = () => {
          if (!kycClickReady) return;
          successOv.removeEventListener('click', advanceToDashboard);
          successOv.style.cursor = 'default';
          successOv.classList.remove('show');
          successOv.style.opacity = '0';
          setTimeout(() => {
            successOv.style.display = 'none';
            successOv.classList.add('hidden');

            const dashboard = document.getElementById('dashboard');
            dashboard.classList.add('fade-in');

            setTimeout(() => {
              document.getElementById('targetRow').classList.remove('hidden');
              setTimeout(() => {
                document.getElementById('sidePanel').classList.add('open');
              }, 600);
            }, 500);
          }, 700);
        };
        successOv.addEventListener('click', advanceToDashboard);

      }, 600);
    }

    async function runAIAnalysis() {
      const aiLayer = document.getElementById('ai-overlay');
      aiLayer.classList.remove('hidden', 'fade-out');
      aiLayer.classList.add('fade-in');

      // Update Stepper
      const step4 = document.getElementById('step4');
      step4.classList.add('active');
      const chip4 = step4.querySelector('.kyc-status-chip');
      if (chip4) chip4.innerText = "GENERATING STRATEGY...";

      // Update Mini-Timeline in table row
      const mini4 = document.getElementById('mini-step-4');
      if (mini4) {
        mini4.style.background = '#2563eb'; // Active blue
        mini4.classList.add('pulse'); // Add a pulse effect if wanted
      }

      const icon1 = document.getElementById('ai-icon-1');
      const text1 = document.getElementById('ai-text-1');
      const stage2 = document.getElementById('ai-stage-2');
      const icon2 = document.getElementById('ai-icon-2');
      const text2 = document.getElementById('ai-text-2');
      const finalOut = document.getElementById('ai-final');
      const stage3 = document.getElementById('ai-stage-3');
      const stage4 = document.getElementById('ai-stage-4');

      // reset AI modal state
      icon1.innerHTML = `<span class="spinner" style="display:block; border-color:rgba(37,99,235,0.2); border-top-color:#2563eb;"></span>`;
      icon1.style.background = '#f1f5f9'; icon1.style.borderColor = '#e2e8f0'; icon1.style.color = 'inherit';
      text1.innerHTML = "Ingesting Client Profile...<br>> Extraction complete.";

      stage2.style.display = 'none';
      stage3.style.display = 'none';

      document.getElementById('ai-actions').style.display = 'flex';

      finalOut.style.display = 'none';
      finalOut.style.opacity = '0';
      finalOut.style.transform = 'translateY(10px)';

      const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

      await new Promise(r => setTimeout(r, 1200));
      text1.innerHTML += "<br>> Industry: SaaS/B2B matched. Analyzing risks...";
      await new Promise(r => setTimeout(r, 1500));
      text1.innerHTML = "Classification complete. Profile tagged as: [Tech / Offshore / Mid-Market]";
      icon1.innerHTML = checkSvg;
      icon1.style.background = '#dcfce7'; icon1.style.borderColor = '#16a34a'; icon1.style.color = '#15803d';

      // Stage 2 Start
      stage2.style.display = 'flex';
      icon2.innerHTML = `<span class="spinner" style="display:block; border-color:rgba(37,99,235,0.2); border-top-color:#2563eb;"></span>`;
      icon2.style.background = '#f1f5f9'; icon2.style.borderColor = '#e2e8f0'; icon2.style.color = 'inherit';
      text2.innerHTML = "Calculating scope vectors... cross-referencing multi-currency logs.";

      await new Promise(r => setTimeout(r, 1500));
      text2.innerHTML = "Generating resource footprint & timeline predictions...";
      await new Promise(r => setTimeout(r, 1800));

      text2.innerHTML = "Analysis complete. Building final scorecard.";
      icon2.innerHTML = checkSvg;
      icon2.style.background = '#dcfce7'; icon2.style.borderColor = '#16a34a'; icon2.style.color = '#15803d';

      await new Promise(r => setTimeout(r, 800));
      finalOut.style.display = 'block';
      void finalOut.offsetWidth; // trigger layout
      finalOut.style.opacity = '1';
      finalOut.style.transform = 'translateY(0)';

      await new Promise(r => setTimeout(r, 2500));
      approveStrategy();
    }

    async function approveStrategy() {
      // Update Stepper
      const step4 = document.getElementById('step4');
      const step5 = document.getElementById('step5');
      step4.classList.remove('active');
      step4.classList.add('completed');
      step4.querySelector('.step-icon').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      step4.querySelector('.kyc-status-chip').innerText = "STRATEGY FINALIZED";
      step4.querySelector('.kyc-status-chip').classList.add('status-completed');

      step5.classList.add('active');
      step5.querySelector('.kyc-status-chip').innerText = "WAITING FOR PARTNER REVIEW";

      // Update Mini-Timeline in table row
      const mini4 = document.getElementById('mini-step-4');
      if (mini4) {
        mini4.style.background = '#10b981'; // Completed green
        mini4.classList.remove('pulse');
      }
      const mini5 = document.getElementById('mini-step-5');
      if (mini5) mini5.style.background = '#2563eb'; // Active blue for partner review phase

      document.getElementById('ai-actions').style.display = 'none';
      await triggerProposalAgent("> Original analysis parameters locked. Initiating draft...");
    }

    let regenerateCount = 0;

    async function regenerateStrategy() {
      regenerateCount++;
      const finalOut = document.getElementById('ai-final');
      const actions = document.getElementById('ai-actions');

      // Hide current final state and actions
      finalOut.style.opacity = '0';
      await new Promise(r => setTimeout(r, 300));
      finalOut.style.display = 'none';
      actions.style.display = 'none';

      // Set stage 2 text and icon back to computing
      const text2 = document.getElementById('ai-text-2');
      const icon2 = document.getElementById('ai-icon-2');
      const terminalDiv = document.querySelector('.scroll-light');

      icon2.innerHTML = `<span class="spinner" style="display:block; border-color:rgba(16,185,129,0.2); border-top-color:#10b981;"></span>`;
      icon2.style.background = '#f1f5f9'; icon2.style.borderColor = '#e2e8f0'; icon2.style.color = 'inherit';
      text2.innerHTML = "Re-evaluating parameters and finding alternatives...<br>> Running multi-variance simulation...";

      await new Promise(r => setTimeout(r, 1800));
      text2.innerHTML += "<br>> Scoring risk matrices using updated weights...";
      setTimeout(() => terminalDiv.scrollTop = terminalDiv.scrollHeight, 100);

      await new Promise(r => setTimeout(r, 1800));

      const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      icon2.innerHTML = checkSvg;
      icon2.style.background = '#dcfce7'; icon2.style.borderColor = '#86efac'; icon2.style.color = '#10b981';
      text2.innerHTML = "Re-evaluation complete.<br>> Generating alternative strategy recommendation.";

      // Cycle through alternative scores
      let scores = [
        { score: "Medium (5.5/10)", label: "Medium Complexity", reason: "Re-classified cross-border operations as standard, reducing scope overlap. Financial auditing is prioritized over heavy cyber-compliance.", req: "Standard Audit framework recommended with specific addendums for non-core regions. Estimated Timeline: 3 Weeks." },
        { score: "High (8.2/10)", label: "Very High Complexity", reason: "Deep dive into financial structure reveals additional regulatory compliance requirements and layered entity trusts.", req: "Comprehensive Tier-1 Audit framework strictly required including forensic analysis. Estimated Timeline: 6-8 Weeks." },
      ];
      let sel = scores[(regenerateCount - 1) % scores.length];

      // Update inner HTML of finalOut (minus the actions which exist outside)
      finalOut.innerHTML = `
           <div style="display:grid; grid-template-columns: 1fr auto; margin-bottom: 20px; align-items:end;">
               <div>
                  <h5 style="color:#64748b; font-size:12px; text-transform:uppercase; font-weight:600; letter-spacing:0.5px; margin-bottom:6px;">Alternative Output Generated</h5>
                  <div style="font-size:18px; font-weight:600; color:#2563eb;">${sel.label}</div>
               </div>
               <div style="text-align:right;">
                  <div style="font-size:32px; font-weight:700; color:#0f172a; line-height:1;">${sel.score.split('(')[1].split('/')[0]}<span style="font-size:14px; color:#64748b;">/10</span></div>
                  <div style="font-size:12px; color:#64748b; margin-top:4px;">Complexity Score</div>
               </div>
           </div>
           <div style="margin-bottom:16px;">
               <h6 style="color:#0f172a; font-size:13px; margin-bottom:6px; font-weight:600;">Executive Synopsis (Alternative)</h6>
               <p style="font-size:13px; color:#475569; line-height:1.5;">${sel.reason}</p>
           </div>
           <div>
               <h6 style="color:#0f172a; font-size:13px; margin-bottom:6px; font-weight:600;">Pricing & Scope Justification</h6>
               <p style="font-size:13px; color:#475569; line-height:1.5;">${sel.req}</p>
           </div>
       `;

      await new Promise(r => setTimeout(r, 600));
      finalOut.style.display = 'block';
      void finalOut.offsetWidth;
      finalOut.style.transform = 'translateY(10px)';
      await new Promise(r => setTimeout(r, 50));
      finalOut.style.opacity = '1';
      finalOut.style.transform = 'translateY(0)';

      setTimeout(() => terminalDiv.scrollTop = terminalDiv.scrollHeight, 100);
    }

    async function triggerProposalAgent(preamble) {
      const stage3 = document.getElementById('ai-stage-3');
      const text3 = document.getElementById('ai-text-3');
      const icon3 = document.getElementById('ai-icon-3');

      stage3.style.display = 'flex';
      // Scroll to bottom of terminal
      const terminalDiv = document.querySelector('.scroll-light');
      setTimeout(() => terminalDiv.scrollTop = terminalDiv.scrollHeight, 100);

      icon3.innerHTML = `<span class="spinner" style="display:block; border-color:rgba(147,51,234,0.2); border-top-color:#9333ea;"></span>`;
      icon3.style.background = '#f1f5f9'; icon3.style.borderColor = '#e2e8f0'; icon3.style.color = 'inherit';

      text3.innerHTML = `${preamble}<br>> Compiling modular service agreements...`;

      await new Promise(r => setTimeout(r, 1500));
      text3.innerHTML += "<br>> Injecting financial KYC data into pricing models...";

      await new Promise(r => setTimeout(r, 1800));
      text3.innerHTML = "Formal Proposal Draft generated successfully.<br><span style='display:inline-flex; align-items:center; gap:8px; margin-top:8px; padding:6px 12px; background:#f3e8ff; border:1px solid #d8b4fe; border-radius:6px; color:#6b21a8; font-weight:600;'><svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>Audit_Offshore_Proposal_v1.pdf</span>";

      const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      icon3.innerHTML = checkSvg;
      icon3.style.background = '#f3e8ff'; icon3.style.borderColor = '#d8b4fe'; icon3.style.color = '#7c3aed';

      setTimeout(() => terminalDiv.scrollTop = terminalDiv.scrollHeight, 100);

      await new Promise(r => setTimeout(r, 2000));
      openPartnerView();
    }

    function closeAI() {
      const ov = document.getElementById('ai-overlay');
      ov.classList.remove('fade-in');
      ov.classList.add('fade-out');
      setTimeout(() => {
        ov.classList.add('hidden');
        ov.classList.remove('fade-out');
      }, 600);
    }

    function openPartnerView() {
      // Show Handover Overlay INSTANTLY ON TOP FIRST
      const handoverOv = document.getElementById('partner-handover-overlay');
      handoverOv.classList.remove('hidden');
      handoverOv.style.display = 'flex';
      void handoverOv.offsetWidth; // Repaint
      handoverOv.classList.add('show');
      handoverOv.style.opacity = '1';

      // After fade-in, safely hide AI modal and side panel without fade-out animation
      setTimeout(() => {
        const aiOv = document.getElementById('ai-overlay');
        aiOv.classList.add('hidden');
        aiOv.classList.remove('fade-in', 'fade-out');
        document.getElementById('sidePanel').classList.remove('open');
      }, 500);

      // Start progress bar
      setTimeout(() => {
        document.getElementById('partner-progress-bar').style.width = '100%';
      }, 100);

      // Reveal badge after 400ms
      setTimeout(() => {
        const badge = document.getElementById('partner-badge');
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
      }, 400);

      // Typewriter — Line 1
      const msg1 = 'Automated analysis is complete. Handing over the finalized document package to the Administrative Partner Portal for review and dispatch.';
      const el1 = document.getElementById('partner-cinematic-text');
      el1.textContent = '';
      let i = 0;
      let partnerClickReady = false;
      const type1 = setInterval(() => {
        el1.textContent += msg1[i++];
        if (i >= msg1.length) {
          clearInterval(type1);

          // Typewriter — Line 2
          setTimeout(() => {
            const el2 = document.getElementById('partner-cinematic-text-2');
            el2.style.opacity = '1';
            const msg2 = 'Switching to Partner View...';
            let j = 0;
            const type2 = setInterval(() => {
              el2.textContent += msg2[j++];
              if (j >= msg2.length) {
                clearInterval(type2);
                // Show click hint and enable click
                setTimeout(() => {
                  document.getElementById('partner-click-hint').style.opacity = '1';
                  handoverOv.style.cursor = 'pointer';
                  partnerClickReady = true;
                }, 400);
              }
            }, 45);
          }, 700);
        }
      }, 24);

      // Persistent click handler
      const advanceToPartner = () => {
        if (!partnerClickReady) return;
        handoverOv.removeEventListener('click', advanceToPartner);
        handoverOv.style.cursor = 'default';
        
        // Swap dashboards instantly while it's fully opaque black
        document.getElementById('dashboard').style.display = 'none';
        const pv = document.getElementById('partner-dashboard');
        pv.classList.remove('hidden');
        
        handoverOv.classList.remove('show');
        handoverOv.style.opacity = '0';
        setTimeout(() => {
          handoverOv.style.display = 'none';
          handoverOv.classList.add('hidden');
        }, 700);
      };
      handoverOv.addEventListener('click', advanceToPartner);
    }

    function showPartnerClientData(clientName) {
      document.getElementById('partner-empty-state').classList.add('hidden');
      const dataView = document.getElementById('partner-client-data');
      dataView.classList.remove('hidden');
      dataView.style.animation = 'fadeIn 0.5s ease';
      document.getElementById('pc-name').innerText = clientName;

      let currentScoreStr = "7.8";
      let currentReasonStr = document.querySelector("#ai-final h6:nth-of-type(1) + p")?.innerText || "Audit Offshore Ltd is a B2B SaaS entity operating across UK borders utilizing dual currencies (GBP/USD). Due to their 11-50 employee size and £1.5M-£5M revenue bracket, standard financial audits must be heavily augmented with deep technical IT infrastructure reviews.";
      let currentReqStr = document.querySelector("#ai-final h6:nth-of-type(2) + p")?.innerText || "Elevated score triggered by cross-border multi-currency transactions and strict Code/IT Auditing requirements. Recommended Scope: Tier 3 Audit Team combining Chartered Accountants with Cyber-security SMEs. Estimated Timeline: 4-6 Weeks.";

      const finalSynopsisEl = document.querySelector("#ai-final h6:first-of-type + p");
      if (finalSynopsisEl) currentReasonStr = finalSynopsisEl.innerText;

      const finalPricingEl = document.querySelector("#ai-final h6:nth-of-type(2) + p");
      if (finalPricingEl) currentReqStr = finalPricingEl.innerText;

      const currentScoreEl = document.querySelector("#ai-final div[style*='font-size:32px']");
      if (currentScoreEl && currentScoreEl.childNodes.length > 0) {
        currentScoreStr = currentScoreEl.childNodes[0].nodeValue.trim();
      }

      document.getElementById('pc-complexity-reason').innerText = currentReasonStr;
      document.getElementById('pc-complexity-req').innerText = currentReqStr;
      document.getElementById('pc-complexity-score').innerHTML = `${currentScoreStr}<span style="font-size:14px; color:#64748b;">/10</span>`;

      // Initialize inline proposal text with structured HTML
      const proposalHTML = `
        <div class="proposal-document" style="padding: 40px; background: white; border: 1px solid #e2e8f0; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="border-bottom: 2px solid #0f172a; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <h1 style="font-size: 24px; color: #0f172a; font-weight: 800; text-transform: uppercase; margin:0;">Service Proposal</h1>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Tailored Compliance Engagement</p>
            </div>
            <div style="text-align: right; color: #475569; font-size: 11px; line-height: 1.6;">
              <strong style="color:#0f172a;">Prepared For:</strong><br>
              ${clientName}<br>
              Date: October 24, 2026
            </div>
          </div>

          <div id="inline-proposal-body" style="font-size: 14px; color: #334155; line-height: 1.6; display: flex; flex-direction: column; gap: 32px;">
            <div class="comment-section-wrapper" id="wrap-synopsis">
              <button class="section-add-comment-btn" onclick="handleSectionClickEvent(event, 'wrap-synopsis')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Add Note
              </button>
              <section id="sec-synopsis">
                <h3 style="font-size: 14px; color: #0f172a; font-weight:700; margin-bottom: 8px; text-transform:uppercase; letter-spacing:0.5px;">1. Executive Synopsis</h3>
                <div class="editable-area" style="padding: 12px; background: #fcfcfc; border: 1px dashed #e2e8f0; border-radius: 6px; color: #475569;">${currentReasonStr}</div>
              </section>
            </div>

            <div class="comment-section-wrapper" id="wrap-scope">
              <button class="section-add-comment-btn" onclick="handleSectionClickEvent(event, 'wrap-scope')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Add Note
              </button>
              <section id="sec-scope">
                <h3 style="font-size: 14px; color: #0f172a; font-weight:700; margin-bottom: 8px; text-transform:uppercase; letter-spacing:0.5px;">2. Engagement Scope & Pricing</h3>
                <div class="editable-area" style="padding: 12px; background: #fcfcfc; border: 1px dashed #e2e8f0; border-radius: 6px; color: #475569;">${currentReqStr}</div>
              </section>
            </div>

            <div class="comment-section-wrapper" id="wrap-timeline">
              <button class="section-add-comment-btn" onclick="handleSectionClickEvent(event, 'wrap-timeline')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Add Note
              </button>
              <section id="sec-timeline">
                <h3 style="font-size: 14px; color: #0f172a; font-weight:700; margin-bottom: 8px; text-transform:uppercase; letter-spacing:0.5px;">3. Project Timeline</h3>
                <div style="display: grid; grid-template-columns: 80px 1fr; gap: 8px 16px; font-size: 13px; background: #fafafa; padding: 12px; border-radius: 6px;">
                  <div style="font-weight: 700; color:#0f172a;">Week 1-2</div><div>Initial Discovery</div>
                  <div style="font-weight: 700; color:#0f172a;">Week 3</div><div>Technical Review</div>
                  <div style="font-weight: 700; color:#0f172a;">Week 4</div><div>Financial Reconciliation</div>
                  <div style="font-weight: 700; color:#0f172a;">Week 5-6</div><div>Drafting & Delivery</div>
                </div>
              </section>
            </div>

          </div>
        </div>
      `;

      document.getElementById('inline-proposal-text').innerHTML = proposalHTML;
    }

    document.getElementById('targetRow').addEventListener('click', () => document.getElementById('sidePanel').classList.add('open'));
    window.addEventListener('load', startAutoFill);

function checkDashboardSig() {
      const val = document.getElementById('client-signature-input').value.trim();
      const btn = document.getElementById('db-btn-authorize');
      if (val.length >= 3) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      } else {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      }
    }

    function authorizeAndSendDashboard(btn) {
      const returnOv = document.getElementById('manager-return-cinematic-overlay');
      if (returnOv) {
        returnOv.classList.remove('hidden');
        returnOv.style.display = 'flex';
        void returnOv.offsetWidth; // Repaint
        returnOv.classList.add('show');
        returnOv.style.opacity = '1';

        const signOverlay = document.getElementById('client-sign-overlay');
        if (signOverlay) signOverlay.classList.add('hidden');

        setTimeout(() => {
          document.getElementById('manager-return-progress').style.width = '100%';
          document.getElementById('manager-return-badge').style.opacity = '1';
          document.getElementById('manager-return-badge').style.transform = 'translateY(0)';
          
          const title = document.getElementById('manager-return-title');
          title.textContent = '';
          const msg1 = "Signature verified and contract immutably sealed. Returning to Manager view...";
          let i = 0;
          let clickReady = false;
          
          const t1 = setInterval(() => {
            title.textContent += msg1[i++];
            if (i >= msg1.length) {
              clearInterval(t1);
              setTimeout(() => {
                document.getElementById('manager-return-msg').textContent = "Engagement successfully authorized.";
                document.getElementById('manager-return-click-hint').style.opacity = '1';
                returnOv.style.cursor = 'pointer';
                clickReady = true;
              }, 600);
            }
          }, 24);

          const advanceToManager = () => {
            if (!clickReady) return;
            returnOv.removeEventListener('click', advanceToManager);
            returnOv.style.cursor = 'default';
            
            handleClientSuccessAction('Approved');
            
            returnOv.classList.remove('show');
            returnOv.style.opacity = '0';
            setTimeout(() => {
              returnOv.style.display = 'none';
              returnOv.classList.add('hidden');
            }, 400);
          };
          
          returnOv.addEventListener('click', advanceToManager);
        }, 100);
      } else {
        handleClientSuccessAction('Approved');
      }
    }

function openPDFPreview() {
      // Find the editable areas in the dashboard document
      const dashSyn = document.querySelector('#sec-synopsis .editable-area');
      const dashReq = document.querySelector('#sec-scope .editable-area');

      // Clear comments before syncing if needed, or maintain them
      // For now, we maintain the global 'comments' array

      if (dashSyn) document.getElementById('pdf-synopsis').innerHTML = dashSyn.innerHTML;
      if (dashReq) document.getElementById('pdf-req').innerHTML = dashReq.innerHTML;

      const pdfo = document.getElementById('pdf-overlay');
      pdfo.classList.remove('hidden', 'fade-out');
      pdfo.classList.add('fade-in');

      // Re-init listeners for the new DOM elements
      initSelectionCommenting();
    }

    function closePDFPreview() {
      // Sync back any changes made in the editor to the dashboard document
      const synHtml = document.getElementById('pdf-synopsis').innerHTML;
      const reqHtml = document.getElementById('pdf-req').innerHTML;

      const dashSyn = document.querySelector('#sec-synopsis .editable-area');
      const dashReq = document.querySelector('#sec-scope .editable-area');

      if (dashSyn) dashSyn.innerHTML = synHtml;
      if (dashReq) dashReq.innerHTML = reqHtml;

      const pdfo = document.getElementById('pdf-overlay');
      pdfo.classList.remove('fade-in');
      pdfo.classList.add('fade-out');
      setTimeout(() => {
        pdfo.classList.add('hidden');
        pdfo.classList.remove('fade-out');
      }, 600);
    }

    let partnerComments = [];

    function handleApprove() {
      // Open the delivery modal for initial dispatch
      const dlvOverlay = document.getElementById('delivery-overlay');
      if (dlvOverlay) {
        dlvOverlay.classList.remove('hidden', 'fade-out', 'fade-in');
        dlvOverlay.style.display = 'flex';
        // Remove animation so it pops up instantly, blocking dashboard view
        dlvOverlay.style.animation = 'none';
        dlvOverlay.style.opacity = '1';

        // Reset all steps
        ['dlv-step-1', 'dlv-step-2', 'dlv-step-3', 'dlv-step-4'].forEach((id, i) => {
          const el = document.getElementById(id);
          if (el) {
            el.style.opacity = i === 0 ? '1' : '0.4';
            el.style.background = '#f8fafc';
            el.style.border = '1px solid #e2e8f0';
          }
        });
        const success = document.getElementById('dlv-success');
        if (success) success.style.display = 'none';
        const closeBtn = document.getElementById('dlv-close-btn');
        if (closeBtn) closeBtn.style.display = 'none';

        // Update notes count text
        const notesEl = document.getElementById('dlv-notes-count');
        if (notesEl) {
          if (partnerComments.length > 0) {
            notesEl.innerText = `Bundling ${partnerComments.length} Partner Note${partnerComments.length > 1 ? 's' : ''} for dispatch...`;
          } else {
            notesEl.innerText = "No internal notes attached.";
          }
        }

        const activateStep = (stepNum, iconColor, iconSvg, onDone) => {
          const stepEl = document.getElementById('dlv-step-' + stepNum);
          const iconEl = document.getElementById('dlv-icon-' + stepNum);
          if (stepEl) {
            stepEl.style.opacity = '1';
            stepEl.style.border = '1px solid ' + iconColor;
            stepEl.style.background = '#f0fdf4';
          }
          if (iconEl) {
            iconEl.style.background = iconColor;
            iconEl.innerHTML = iconSvg;
          }
          setTimeout(onDone, 1200);
        };

        const checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

        // Step 1: Package
        setTimeout(() => {
          activateStep(1, '#16a34a', checkSvg, () => {
            // Step 2: Notes
            activateStep(2, '#7c3aed', checkSvg, () => {
              // Step 3: Email
              activateStep(3, '#2563eb', checkSvg, () => {
                // Step 4: WhatsApp
                activateStep(4, '#16a34a', checkSvg, () => {
                  // Show success UI in the modal
                  if (success) success.style.display = 'block';
                  if (closeBtn) closeBtn.style.display = 'flex';

                  // Update background state
                  finalizeStatusUpdate();
                });
              });
            });
          });
        }, 800);
      } else {
        // Fallback if overlay missing
        finalizeStatusUpdate();
      }

      function finalizeStatusUpdate() {
        // ✅ Update Stepper: Step 6 → Completed, Step 7 → Active
        const step6 = document.getElementById('step6');
        const step7 = document.getElementById('step7');
        if (step6) {
          step6.classList.remove('active');
          step6.classList.add('completed');
          step6.querySelector('.step-icon').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          const chip6 = step6.querySelector('.kyc-status-chip');
          if (chip6) {
            chip6.innerText = 'DISPATCHED TO CLIENT';
            chip6.classList.add('status-completed');
          }
        }
        if (step7) {
          step7.classList.add('active');
          const chip7 = step7.querySelector('.kyc-status-chip');
          if (chip7) chip7.innerText = 'AWAITING CLIENT DECISION';
        }

        // Disable action bar buttons
        const stateDiv = document.getElementById('partner-action-state');
        if (stateDiv) stateDiv.innerHTML = '';
        const bar = document.querySelector('#partner-client-data > div[style*="justify-content:flex-end"]');
        if (bar) { bar.style.opacity = '0.4'; bar.style.pointerEvents = 'none'; }
      }
    }

    function closeDeliveryModal() {
      const dlvOverlay = document.getElementById('delivery-overlay');
      dlvOverlay.classList.remove('fade-in');
      dlvOverlay.classList.add('fade-out');
      setTimeout(() => {
        dlvOverlay.classList.add('hidden');
        dlvOverlay.classList.remove('fade-out');
      }, 300);
    }

    async function toggleInlineEdit() {
      const container = document.getElementById('inline-proposal-text');
      const editableAreas = container.querySelectorAll('.editable-area');
      const btn = document.getElementById('inline-edit-btn');
      const isEditing = btn.innerText.includes('Save');

      if (!isEditing) {
        // Switch to Edit Mode
        editableAreas.forEach(area => {
          area.contentEditable = "true";
          area.style.background = '#ffffff';
          area.style.border = '2px solid #2563eb';
          area.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)';
        });

        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = `<span>Editing...</span>`;

        // Simulate a professional revision insertion in the Scope section
        const targetArea = container.querySelector('#sec-scope .editable-area') || editableAreas[1];
        const revisionHtml = `
            <div style="margin-top:16px; padding:12px; background:#f0f9ff; border-left:4px solid #0ea5e9; border-radius:4px;">
                <div style="font-size:11px; font-weight:800; color:#0369a1; text-transform:uppercase; margin-bottom:4px;">Partner Revision: Premium Service Module</div>
                <ul style="margin:0; padding-left:18px; font-size:13px; color:#0c4a6e;">
                    <li>Expanded scope to include real-time crypto-custody audit requirements.</li>
                    <li>Appointed Senior Auditor for jurisdictional compliance oversight (SGP/UK).</li>
                    <li>Adjusted lead time: +2 business days for technical depth.</li>
                </ul>
            </div>
        `;

        // Proper layout preservation vs raw text append
        setTimeout(() => {
          if (targetArea) targetArea.insertAdjacentHTML('beforeend', revisionHtml);
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:8px;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Save Proposal Changes
            `;
          btn.style.background = '#10b981'; // Success Green
        }, 1000);

      } else {
        // Switch to View Mode / Save
        editableAreas.forEach(area => {
          area.contentEditable = "false";
          area.style.background = '#fcfcfc';
          area.style.border = '1px dashed #e2e8f0';
          area.style.boxShadow = 'none';
        });

        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit Proposal
        `;
        btn.style.background = '#2563eb';

        // Feedback
        const stateArea = document.getElementById('partner-action-state');
        stateArea.innerHTML = `
          <div class="fade-in" style="background:#f0fdf4; border:1px solid #bbf7d0; padding:16px 20px; border-radius:10px; display:flex; align-items:center; gap:12px; color:#15803d; font-size:14px; font-weight:600;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Proposal draft updated and saved.
          </div>
        `;
        setTimeout(() => { if (stateArea && stateArea.innerHTML.includes('saved')) stateArea.innerHTML = ''; }, 3000);
      }
    }

    async function handleEdit() {
      // Re-map the action bar edit button to jump to the inline proposal
      const el = document.getElementById('inline-proposal-text');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const isReadonly = el.hasAttribute('readonly');
      if (isReadonly) {
        setTimeout(() => toggleInlineEdit(), 400); // Wait for scroll to finish
      }
    }

    async function handleComment() {
      // Open the comment section first so the user sees the UI box
      renderCommentSection();

      const inputEl = document.getElementById('new-comment-input');
      const submitBtn = document.querySelector('#comment-list-container .btn');

      // Add first dummy comment
      inputEl.disabled = true;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      await simulateTyping('new-comment-input', "Reviewed the dual-currency parameters. Looks good, but please attach the standard offshore liability addendum to Appendix B.", 15);
      inputEl.disabled = false;
      addCommentToList();

      // Small pause
      await new Promise(r => setTimeout(r, 800));

      // Add second dummy comment
      inputEl.disabled = true;
      await simulateTyping('new-comment-input', "Also, ensure the IT audit SME has specific clearance for their Singapore subsidiary.", 15);
      inputEl.disabled = false;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      addCommentToList();
    }

    function renderCommentSection() {
      const stateDiv = document.getElementById('partner-action-state');
      let commentsHtml = partnerComments.map((c, i) => `
        <div class="fade-in" style="background:white; padding:12px 16px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; color:#475569; margin-bottom:10px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
           <div style="flex-grow:1;">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
               <span style="font-weight:700; color:#94a3b8; font-size:10px; text-transform:uppercase;">Note #${i + 1}</span>
               <span style="font-size:10px; color:#94a3b8; font-weight:600;">${c.timestamp}</span>
             </div>
             ${c.text}
           </div>
           <button onclick="removeComment(${i})" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:4px; margin-top:2px;">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>
      `).join('');

      stateDiv.innerHTML = `
        <div id="comment-list-container" class="fade-in" style="background:#f8fafc; border:1px solid #e2e8f0; padding:24px; border-radius:12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
             <h4 style="font-size:14px; font-weight:600; color:var(--text-main); margin:0;">Partner Review Notes</h4>
             <span style="font-size:11px; background:#e2e8f0; color:#64748b; padding:2px 8px; border-radius:12px; font-weight:600;">${partnerComments.length} Items</span>
           </div>
           
           <div id="comments-list" style="margin-bottom:20px;">
              ${commentsHtml || '<div style="color:#94a3b8; font-size:13px; font-style:italic; text-align:center; padding:20px; border:1px dashed #cbd5e1; border-radius:8px;">No internal notes added yet.</div>'}
           </div>

           <div style="display:flex; gap:12px; background:white; padding:4px; border-radius:10px; border:1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <textarea id="new-comment-input" rows="1" 
                style="flex-grow:1; padding:12px 16px; border:none; border-radius:8px; font-family:inherit; resize:none; font-size:13px; outline:none;" 
                placeholder="Add a specific note or addendum..."
                onkeydown="if(event.key === 'Enter' && !event.shiftKey){ event.preventDefault(); addCommentToList(); }"></textarea>
              <button class="btn" style="width:auto; padding:0 20px; margin:0; background:#2563eb; border-radius:8px;" onclick="addCommentToList()">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
           </div>
           
           <div style="margin-top:16px; padding-top:16px; border-top:1px dashed #e2e8f0; color:#64748b; font-size:12px; font-style:italic;">
              Notes will be bundled automatically and sent to the Audit Manager.
           </div>
        </div>
      `;
      document.getElementById('new-comment-input').focus();
    }

    function addCommentToList() {
      const input = document.getElementById('new-comment-input');
      const val = input.value.trim();
      if (val) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        partnerComments.push({ text: val, timestamp: time });
        renderCommentSection();
      }
    }

    function removeComment(index) {
      partnerComments.splice(index, 1);
      renderCommentSection();
    }

    let isProposalRejected = false;
    let rejectionReasonText = "";

    function openRejectModal() {
      const overlay = document.getElementById('partner-reject-overlay');
      overlay.classList.remove('hidden');

      const area = document.getElementById('reject-reason-input');
      const btn = document.getElementById('btn-submit-reject');

      area.value = "";
      btn.disabled = true;
      btn.style.opacity = '0.5';

      const reasonToType = "The technical scope is insufficient for the dual-currency complexity described. Please revise the IT audit allocation and increase the initial assessment time by 4 days.";
      rejectionReasonText = reasonToType;

      let i = 0;
      const tick = setInterval(() => {
        if (i < reasonToType.length) {
          area.value += reasonToType[i];
          i++;
        } else {
          clearInterval(tick);
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }, 20); // typing speed
    }

    function handleReturnToManager(rejected = false) {
      isProposalRejected = rejected;
      if (rejected) {
        document.getElementById('partner-reject-overlay').classList.add('hidden');
      }

      // Handover overlay setup
      const handoverOverlay = document.getElementById('manager-handover-overlay');

      // Update Stepper
      const step5 = document.getElementById('step5');
      const step6 = document.getElementById('step6');
      if (step5 && step6) {
        step5.classList.remove('active');
        step5.classList.add('completed');
        step5.querySelector('.step-icon').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        const chip5 = step5.querySelector('.kyc-status-chip');
        const chip6 = step6.querySelector('.kyc-status-chip');

        if (rejected) {
          chip5.innerText = "REJECTED BY PARTNER";
          chip5.style.background = "#fef2f2";
          chip5.style.color = "#ef4444";
          chip5.style.borderColor = "#fecaca";
          chip6.innerText = "AWAITING REVISION";
        } else {
          chip5.innerText = "VERIFIED BY PARTNER";
          chip5.classList.add('status-completed');
          chip6.innerText = "WAITING FOR CLIENT DISPATCH";
        }

        step6.classList.add('active');
      }

      // Update Manager Dashboard Table Row
      const row = document.getElementById('targetRow');
      row.innerHTML = `
        <td>
          <div class="entity-cell">
            <div class="entity-icon" style="background:#eff6ff; color:#2563eb; border-color:#dbeafe">A</div>
            <div class="entity-info"><span class="entity-name">Audit offshore</span><span
                class="entity-email">info@auditoffshore.com</span></div>
          </div>
        </td>
        <td>Audit Offshore Ltd.</td>
        <td style="color:var(--text-secondary);">+1 (800) 555-1234</td>
        <td>
           <div style="display:flex; align-items:center; gap:12px;">
             ${rejected ?
          `<span style="color:#b91c1c; background:#fef2f2; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #fecaca;">
               <div style="width:6px;height:6px;background:#ef4444;border-radius:50%"></div>Rejected
             </span>` :
          `<span style="color:#15803d; background:#f0fdf4; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #bbf7d0;">
               <div style="width:6px;height:6px;background:#10b981;border-radius:50%"></div>Approval Received
             </span>`}
           </div>
        </td>
        <td>
           <div style="display:flex; gap:4px;">
              <div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#2563eb; border-radius:3px;"></div>
              <div style="width:16px; height:6px; background:#e2e8f0; border-radius:3px;"></div>
           </div>
        </td>
        <td>
           <button class="btn" style="width:auto; padding:6px 14px; margin:0; font-size:12px; background:#2563eb; display:flex; align-items:center; gap:6px; border-radius:16px; min-height:0; font-weight:600;" onclick="openManagerReviewModal(event)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Review
           </button>
        </td>
      `;
      row.removeAttribute("onclick");
      row.style.cursor = 'default';

      // Show cinematic black screen
      handoverOverlay.classList.remove('hidden');
      handoverOverlay.style.display = 'flex';
      handoverOverlay.classList.add('show');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handoverOverlay.style.opacity = '1';
        });
      });

      // Start progress bar
      setTimeout(() => {
        document.getElementById('manager-progress-bar').style.width = '100%';
      }, 100);

      // Dynamics for approved vs rejected
      const badgeText = document.querySelector('#manager-handover-badge span');
      const badgeSvg = document.querySelector('#manager-handover-badge svg');
      const badgeContainer = document.getElementById('manager-handover-badge');

      if (rejected) {
        badgeText.innerText = "Partner Review Rejected";
        badgeText.style.color = "#ef4444";
        badgeContainer.style.background = "rgba(239,68,68,0.12)";
        badgeContainer.style.borderColor = "rgba(239,68,68,0.3)";
        badgeContainer.children[0].style.background = "rgba(239,68,68,0.15)";
        badgeSvg.innerHTML = `<path d="M18 6L6 18M6 6l12 12"></path>`;
        badgeSvg.setAttribute('stroke', '#ef4444');
      } else {
        badgeText.innerText = "Partner Verification Complete";
        badgeText.style.color = "#22c55e";
        badgeContainer.style.background = "rgba(34,197,94,0.12)";
        badgeContainer.style.borderColor = "rgba(34,197,94,0.3)";
        badgeContainer.children[0].style.background = "rgba(34,197,94,0.15)";
        badgeSvg.innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`;
        badgeSvg.setAttribute('stroke', '#22c55e');
      }

      // Reveal badge after 400ms
      setTimeout(() => {
        badgeContainer.style.opacity = '1';
        badgeContainer.style.transform = 'translateY(0)';
      }, 400);

      const msg1 = rejected ?
        'Proposal review complete. The document has been rejected by the Partner and returned to the Global Audit Manager for revision.' :
        'Proposal reviewed and verified. Routing back to the Global Audit Manager for final client dispatch.';

      const el1 = document.getElementById('manager-cinematic-text');
      el1.textContent = '';
      let i = 0;
      let managerClickReady = false;
      const type1 = setInterval(() => {
        el1.textContent += msg1[i++];
        if (i >= msg1.length) {
          clearInterval(type1);

          setTimeout(() => {
            const el2 = document.getElementById('manager-cinematic-text-2');
            el2.style.opacity = '1';
            const msg2 = 'Switching to Manager Dashboard...';
            let j = 0;
            const type2 = setInterval(() => {
              el2.textContent += msg2[j++];
              if (j >= msg2.length) {
                clearInterval(type2);
                setTimeout(() => {
                  document.getElementById('manager-click-hint').style.opacity = '1';
                  handoverOverlay.style.cursor = 'pointer';
                  managerClickReady = true;
                }, 400);
              }
            }, 45);
          }, 700);
        }
      }, 24);

      // Persistent click handler
      const advanceToManager = () => {
        if (!managerClickReady) return;
        handoverOverlay.removeEventListener('click', advanceToManager);
        handoverOverlay.style.cursor = 'default';
        
        // Swap dashboards immediately behind the opaque black screen
        document.getElementById('partner-dashboard').classList.add('hidden');
        document.getElementById('partner-dashboard').classList.remove('fade-in');
        document.getElementById('dashboard').style.display = 'grid';

        handoverOverlay.classList.remove('show');
        handoverOverlay.style.opacity = '0';
        
        setTimeout(() => {
          handoverOverlay.style.display = 'none';
          handoverOverlay.classList.add('hidden');
        }, 700);
      };
      handoverOverlay.addEventListener('click', advanceToManager);
    }

    function openManagerReviewModal(e) {
      if (e) e.stopPropagation();

      const overlay = document.getElementById('manager-review-overlay');
      const display = document.getElementById('manager-review-proposal-display');
      const source = document.getElementById('inline-proposal-text');

      // Sync rich proposal content (HTML includes highlights and section indicators)
      if (display && source) {
        display.innerHTML = source.innerHTML;
        // Ensure no editable borders appear in manager view
        const areas = display.querySelectorAll('.editable-area');
        areas.forEach(a => {
          a.style.border = 'none';
          a.style.padding = '0';
          a.style.background = 'transparent';
          a.style.boxShadow = 'none';
        });
      }

      // Render partner comments
      let commentsHtml = '';
      if (isProposalRejected) {
        commentsHtml = `
           <div style="background:#fff; border:1px solid #fecaca; border-left:4px solid #ef4444; padding:16px; border-radius:4px; margin-bottom:12px;">
              <div style="font-size:11px; font-weight:700; color:#ef4444; text-transform:uppercase; margin-bottom:8px;">Reason for Rejection</div>
              <div style="font-size:14px; color:#334155; line-height:1.6;">${rejectionReasonText}</div>
           </div>
         `;
        document.getElementById('manager-review-title').innerText = "Audit Offshore Ltd. — Partner Rejected";
        document.getElementById('manager-review-section-header').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Partner Rejection Reason`;
      } else if (partnerComments.length > 0) {
        document.getElementById('manager-review-title').innerText = "Audit Offshore Ltd. — Partner approved with notes";
        document.getElementById('manager-review-section-header').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Partner Internal Notes`;
        commentsHtml = partnerComments.map(c => `
           <div style="background:#fff; border:1px solid #e2e8f0; border-left:4px solid #7c3aed; padding:16px; border-radius:4px; margin-bottom:12px; cursor: pointer; transition: all 0.2s;" 
                onmouseover="this.style.borderColor='#7c3aed'" onmouseout="this.style.borderColor='#e2e8f0'"
                onclick="scrollToManagerHighlight('${c.id}')">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                 <div style="font-size:11px; font-weight:700; color:#7c3aed; text-transform:uppercase;">${c.isSection ? 'Section Note' : 'Text Annotation'}</div>
                 <div style="font-size:11px; color:#94a3b8;">${c.timestamp}</div>
              </div>
              ${c.isSection ? '' : `<div style="font-size:12px; color:#64748b; font-style:italic; margin-bottom:6px; background:#f8fafc; padding:4px 8px; border-radius:4px;">"${c.selectedText}"</div>`}
              <div style="font-size:14px; color:#334155; line-height:1.6;">${c.comment}</div>
              <div style="font-size:10px; color:#94a3b8; margin-top:8px; text-align:right;">Click to view in document &rsaquo;</div>
           </div>
         `).join('');
      } else {
        document.getElementById('manager-review-title').innerText = "Audit Offshore Ltd. — Partner approved";
        document.getElementById('manager-review-section-header').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Partner Internal Notes`;
        commentsHtml = `<div style="color:#94a3b8; font-size:13px; font-style:italic;">No internal partner notes attached.</div>`;
      }
      document.getElementById('manager-review-comments').innerHTML = commentsHtml;

      overlay.classList.remove('hidden');
    }



    async function toggleClientEdit() {
      const area = document.getElementById('client-proposal-text');
      const btn = document.getElementById('client-edit-btn');
      const isReadonly = area.hasAttribute('readonly');

      if (isReadonly) {
        area.removeAttribute('readonly');
        area.style.background = '#ffffff'; // Clean white for editing
        area.style.borderColor = '#2563eb';
        area.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
        area.focus();

        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = `Applying Markup...`;

        const clientRevision = `\n\n[CLIENT FEEDBACK & ADJUSTMENT]\n- Requested clarification on Technical Infrastructure Review depth.\n- Confirmed availability for systems access integration in Week 1.\n- Note: Please ensure all dual-currency reconciliations include the offshore liability addendum.`;

        let i = 0;
        const tick = setInterval(() => {
          if (i < clientRevision.length) {
            area.value += clientRevision[i++];
            area.scrollTop = area.scrollHeight;
          } else {
            clearInterval(tick);
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:6px;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Save Markup & Feedback
            `;
            btn.style.background = '#059669'; // success green
          }
        }, 20);

      } else {
        area.setAttribute('readonly', 'true');
        area.style.background = 'white';
        area.style.borderColor = '#e2e8f0';
        area.style.boxShadow = 'none';
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Enable Editing / Markup
        `;
        btn.style.background = '#2563eb';
      }
    }

    let clientComments = [];
    function addClientComment() {
      const input = document.getElementById('client-comment-input');
      const text = input.value.trim();
      if (!text) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      clientComments.push({ text, timestamp: time });
      input.value = '';
      renderClientComments();
    }

    function renderClientComments() {
      const list = document.getElementById('client-comments-list');
      if (clientComments.length === 0) {
        list.innerHTML = `<div style="color:#94a3b8; font-size:13px; font-style:italic; text-align:center; padding:20px; border:1px dashed #cbd5e1; border-radius:8px;">No comments yet.</div>`;
        return;
      }

      list.innerHTML = clientComments.map((c, i) => `
        <div class="fade-in" style="background:#f8fafc; padding:12px; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:700; color:#0f172a; font-size:11px;">You</span>
            <span style="font-size:10px; color:#94a3b8;">${c.timestamp}</span>
          </div>
          <div style="font-size:13px; color:#475569;">${c.text}</div>
        </div>
      `).join('');
      list.scrollTop = list.scrollHeight;
    }

    function openClientRejectModal() {
      document.getElementById('client-reject-overlay').classList.remove('hidden');
    }

    function handleClientSuccessAction(status) {
      // Hide all potential overlays
      const overlays = [
        'client-reject-overlay',
        'client-sign-overlay',
        'delivery-overlay',
        'onboarding-dispatch-overlay',
        'manager-review-overlay'
      ];
      overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      // Immediately return to manager dashboard
      document.getElementById('client-dashboard').classList.add('hidden');

      const dash = document.getElementById('dashboard');
      if (dash) {
        dash.style.display = 'grid';
        dash.style.opacity = '1';
      }

      updateManagerDashboardWithClientStatus(status);
    }

    function updateManagerDashboardWithClientStatus(status) {
      const row = document.getElementById('targetRow');
      const isApproved = status === 'Approved';
      const isFullySubmitted = status === 'Documents Submitted';

      // Update ALL steps if fully submitted
      const allSteps = [1, 2, 3, 4, 5, 6, 7];
      allSteps.forEach(num => {
        const stepEl = document.getElementById('step' + num);
        if (stepEl) {
          stepEl.classList.remove('active');
          stepEl.classList.add('completed');
          const stepIcon = stepEl.querySelector('.step-icon');
          if (stepIcon) {
            stepIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          }
          const chip = stepEl.querySelector('.kyc-status-chip');
          if (chip) {
            if (num < 7) {
              chip.innerText = "VERIFIED";
              chip.className = 'kyc-status-chip status-completed';
            } else {
              chip.innerText = isFullySubmitted ? "DOCUMENTS INGESTED" : (isApproved ? "CLIENT AUTHORIZED" : "CLIENT REJECTED");
              chip.className = 'kyc-status-chip status-completed';
              if (!isApproved && !isFullySubmitted) {
                chip.style.background = "#fef2f2";
                chip.style.color = "#ef4444";
                stepEl.querySelector('p').innerText = "Client has requested revisions to the proposal.";
              }
            }
          }
        }
      });

      // Update the table row in manager view
      let statusBadge = '';
      if (isFullySubmitted) {
        statusBadge = `
          <span style="color:#059669; background:#f0fdf4; padding:4px 10px; border-radius:16px; font-weight:700; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #bbf7d0; box-shadow: 0 0 10px rgba(16,185,129,0.1);">
            <div style="width:6px;height:6px;background:#10b981;border-radius:50%; animation: pulse-glow 2s infinite;"></div>Submission Verified
          </span>`;
      } else {
        statusBadge = isApproved ?
          `<span style="color:#0369a1; background:#f0f9ff; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #bae6fd;">
            <div style="width:6px;height:6px;background:#0ea5e9;border-radius:50%"></div>Ready for Partner
          </span>` :
          `<span style="color:#b91c1c; background:#fef2f2; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #fecaca;">
            <div style="width:6px;height:6px;background:#ef4444;border-radius:50%"></div>Client Rejected
          </span>`;
      }

      row.innerHTML = `
        <td>
          <div class="entity-cell">
            <div class="entity-icon" style="background:#eff6ff; color:#2563eb; border-color:#dbeafe">A</div>
            <div class="entity-info"><span class="entity-name">Audit offshore</span><span
                class="entity-email">info@auditoffshore.com</span></div>
          </div>
        </td>
        <td>Audit Offshore Ltd.</td>
        <td style="color:var(--text-secondary);">+1 (800) 555-1234</td>
        <td>
           <div style="display:flex; align-items:center; gap:12px;">
             ${statusBadge}
           </div>
        </td>
        <td>
           <div style="display:flex; gap:4px;">
              ${Array(7).fill('<div style="width:16px; height:6px; background:#10b981; border-radius:3px;"></div>').join('')}
           </div>
        </td>
        <td>
           <button class="btn" style="width:auto; padding:6px 14px; margin:0; font-size:12px; background:${isFullySubmitted ? '#059669' : '#7c3aed'}; color:white; border:none; display:flex; align-items:center; gap:6px; border-radius:16px; min-height:0; font-weight:600; box-shadow: 0 2px 4px rgba(124,58,237,0.2);" onclick="event.stopPropagation(); this.innerHTML='✓ Locked'; this.style.background='#64748b';">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              ${isFullySubmitted ? 'Files Locked' : 'Send to Partner'}
           </button>
        </td>
      `;

      // Handle Document Ingestion Tracker view update
      const ingestionRow = document.getElementById('ingestionRow1');
      if (ingestionRow && isFullySubmitted) {
        ingestionRow.querySelector('#progress-label-1').innerText = "6/6 Documents Verified";
        ingestionRow.querySelector('#progress-percent-1').innerText = "100%";
        ingestionRow.querySelector('#progress-percent-1').style.color = "#059669";

        const progBars = ingestionRow.querySelector('#progress-bars-1');
        if (progBars) {
          progBars.innerHTML = Array(6).fill('<div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>').join('');
        }

        ingestionRow.querySelector('#progress-name-1').innerHTML = "All documents <strong>Secured & Analyzed</strong> ✓";

        const validationStatus = ingestionRow.querySelector('td:nth-child(4)');
        if (validationStatus) {
          validationStatus.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <span style="color:#059669; background:#ecfdf5; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #a7f3d0; width:fit-content;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        All Validated
                    </span>
                    <span style="font-size:11px; color:#64748b;">Cross-reconciliation complete.</span>
                </div>
            `;
        }

        const deadlineCell = document.getElementById('deadlineCell1');
        if (deadlineCell) {
          deadlineCell.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <span style="font-size:12px; font-weight:700; color:#059669;">COMPLETED</span>
                    <span style="font-size:11px; color:#94a3b8;">Ahead of Schedule</span>
                </div>
            `;
        }
      }

      // Update Side Panel Footer Actions
      const aiBtn = document.getElementById('side-panel-ai-btn');
      const sendLinkBtn = document.getElementById('side-panel-send-link-btn');

      if (isApproved || isFullySubmitted) {
        if (aiBtn) aiBtn.style.display = 'none';
        if (sendLinkBtn) {
          if (isFullySubmitted) {
            sendLinkBtn.innerHTML = '✓ All Documents Ingested';
            sendLinkBtn.style.background = '#64748b';
            sendLinkBtn.style.pointerEvents = 'none';
          }
          sendLinkBtn.style.display = 'inline-flex';
          sendLinkBtn.classList.add('fade-in');
        }
      }

      // Re-open side panel to show updated timeline
      const sidePanel = document.getElementById('sidePanel');
      if (sidePanel) {
        sidePanel.classList.add('open');
      }
    }

    let clientPortalWindow = null;

    function switchDashboardView(viewId, navElement) {
      if (!navElement) return;

      // Update Nav active state
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      navElement.classList.add('active');

      // Hide all views
      document.getElementById('view-lead-ops')?.classList.add('hidden');
      document.getElementById('view-doc-upload')?.classList.add('hidden');
      // For overview we don't have a view yet, so we just hide the other two for now

      if (viewId === 'overview') {
        document.getElementById('view-lead-ops')?.classList.remove('hidden'); // Fall back to Lead Ops
        navElement.classList.remove('active');
        document.getElementById('nav-lead-ops').classList.add('active');
        return;
      }

      // Show selected view
      document.getElementById(viewId)?.classList.remove('hidden');
    }

    // Listen for Client Portal completion
    window.addEventListener("message", (event) => {
      if (event.data === "data_ingestion_complete") {
        updateIngestionTrackerToComplete();
      }
      if (event.data && event.data.type === "step_updated") {
        updateLiveProgress(event.data.step);
      }
    });

    const sectionNames = [
      "Company & Legal",
      "Core Financial Data",
      "Banking & Treasury",
      "Revenue & Tax",
      "Supporting Schedules",
      "Smart Integration"
    ];

    function updateLiveProgress(step) {
      if (step < 1 || step > 6) return;

      const percent = Math.round((step / 6) * 100);
      const sectionName = sectionNames[step - 1];

      const progressLabel = document.getElementById("progress-label-1");
      const progressPercent = document.getElementById("progress-percent-1");
      const progressName = document.getElementById("progress-name-1");
      const progressBars = document.getElementById("progress-bars-1");

      if (progressLabel) progressLabel.innerText = `Section ${step}/6 Active`;
      if (progressPercent) progressPercent.innerText = `${percent}%`;
      if (progressName) progressName.innerHTML = `Currently reviewing: <strong>${sectionName}</strong>`;

      if (progressBars) {
        Array.from(progressBars.children).forEach((bar, index) => {
          if (index < step) {
            bar.style.background = "#10b981"; // green
          } else {
            bar.style.background = "#e2e8f0"; // grey
          }
        });
      }
    }

    function pingClient(rowId) {
      if (!clientPortalWindow || clientPortalWindow.closed) {
        clientPortalWindow = window.open('client-portal.html', '_blank');
      } else {
        clientPortalWindow.focus();
      }

      // Show local feedback that ping was sent
      const btn = event.currentTarget;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Pinged!`;
      btn.style.background = "#dcfce7";
      btn.style.color = "#166534";

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.background = "#fef3c7";
        btn.style.color = "#92400e";
      }, 2000);

      // Get days left
      const timerRowId = rowId === 'row1' ? 'timer-row1' : 'timer-row2';
      const timerRow = document.getElementById(timerRowId);
      const daysLeft = timerRow ? timerRow.innerText.toLowerCase() : "a few days left";

      setTimeout(() => {
        if (clientPortalWindow && !clientPortalWindow.closed) {
          clientPortalWindow.postMessage({ type: "ping_client_advanced", days: daysLeft }, "*");
        }
      }, 1000);
    }

    // Fallback if portal redirects
    if (window.location.search.includes('data=received')) {
      // Small timeout to allow render
      setTimeout(() => {
        showIngestionCinematicOverlay();
      }, 500);
    }

    function showIngestionCinematicOverlay() {
      const overlay = document.getElementById('ingestion-success-overlay');
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      overlay.classList.add('show');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = '1';
        });
      });

      const pb = document.getElementById('ingestion-progress-bar');
      pb.style.width = '0%';

      const badge = document.getElementById('ingestion-badge');
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(10px)';

      const el1 = document.getElementById('ingestion-cinematic-text');
      const el2 = document.getElementById('ingestion-cinematic-text-2');
      const hint = document.getElementById('ingestion-click-hint');

      el1.textContent = '';
      el2.textContent = '';
      el2.style.opacity = '0';
      hint.style.opacity = '0';

      let clickReady = false;

      setTimeout(() => {
        pb.style.width = '100%';

        setTimeout(() => {
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';

          setTimeout(() => {
            const msg1 = 'Client data ingestion protocol completed. Encrypted financial documents received successfully.';
            let i = 0;
            const type1 = setInterval(() => {
              el1.textContent += msg1[i++];
              if (i >= msg1.length) {
                clearInterval(type1);

                setTimeout(() => {
                  el2.style.opacity = '1';
                  const msg2 = 'Switching to Document Validation Matrix...';
                  let j = 0;
                  const type2 = setInterval(() => {
                    el2.textContent += msg2[j++];
                    if (j >= msg2.length) {
                      clearInterval(type2);

                      setTimeout(() => {
                        hint.style.opacity = '1';
                        overlay.style.cursor = 'pointer';
                        clickReady = true;
                      }, 500);
                    }
                  }, 30);
                }, 600);
              }
            }, 25);
          }, 600);
        }, 400);
      }, 300);

      const advance = () => {
        if (!clickReady) return;
        overlay.removeEventListener('click', advance);
        overlay.style.cursor = 'default';
        overlay.style.opacity = '0';

        setTimeout(() => {
          overlay.classList.remove('show');
          overlay.classList.add('hidden');
          overlay.style.display = 'none';

          updateIngestionTrackerToComplete();
        }, 800);
      };

      overlay.addEventListener('click', advance);
    }

    function updateIngestionTrackerToComplete() {
      // Ensure we switch to the ingestion view
      const navItem = document.getElementById('nav-doc-upload');
      if (navItem) switchDashboardView('view-doc-upload', navItem);

      const row = document.getElementById('ingestionRow1');
      if (row) {
        row.innerHTML = `
          <td>
            <div class="entity-cell">
              <div class="entity-icon" style="background:#eff6ff; color:#2563eb; border-color:#dbeafe">A</div>
              <div class="entity-info"><span class="entity-name">Audit offshore</span><span
                  class="entity-email">info@auditoffshore.com</span></div>
            </div>
          </td>
          <td>Audit Offshore Ltd.</td>
          <td style="width: 300px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#475569;">
                <span>Step 6/6 Completed</span>
                <span style="color:#059669;">100%</span>
              </div>
              <div style="display:flex; gap:4px; width:100%;">
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
                <div style="flex:1; height:6px; background:#10b981; border-radius:3px;"></div>
              </div>
              <div style="font-size:11px; color:#10b981; margin-top:2px; font-weight:600;">Financial Data Received</div>
            </div>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="display:flex; flex-direction:column; gap:4px;">
                <span style="color:#15803d; background:#f0fdf4; padding:4px 10px; border-radius:16px; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:6px; border:1px solid #bbf7d0; width:fit-content;">
                  <div style="width:6px;height:6px;background:#10b981;border-radius:50%"></div>
                  Automated Validation Complete
                </span>
              </div>
              <button class="btn" style="width:auto; padding:8px 16px; margin:0; font-size:12px; background:#2563eb; display:flex; align-items:center; gap:6px; border-radius:16px; min-height:0; font-weight:600;" onclick="alert('Audit Package successfully dispatched to partner portal.')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Send to Partner
              </button>
            </div>
          </td>
        `;
      }
    }

    function sendOnboardingLink(element) {
      const btn = element || document.getElementById('side-panel-send-link-btn');
      if (!btn) {
        window.open('client-portal.html', '_blank');
        return;
      }

      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<span class="spinner" style="margin-right:8px; border-top-color:white; width:12px; height:12px;"></span> Transmitting link...`;
      btn.disabled = true;
      btn.style.opacity = '0.8';

      setTimeout(() => {
        // Reset button
        btn.innerHTML = `
          <svg style="margin-right:8px" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Link Sent Successfully
        `;
        btn.style.background = '#0d9488';
        btn.style.color = '#ffffff';

        // Immediately open the standalone client portal (bypassing overlay)
        window.open('client-portal.html', '_blank');

      }, 800); // reduced timeout to be much faster
    }

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', () => {
      // Ensure dashboard is visible immediately
      const dash = document.getElementById('dashboard');
      if (dash) dash.style.opacity = '1';

      initSelectionCommenting();
    });

    // --- Selection Commenting Logic ---
    let currentSelection = null;
    let comments = [];

    function initSelectionCommenting() {
      const ids = ['pdf-synopsis', 'pdf-req', 'pdf-timeline', 'pc-complexity-reason', 'pc-complexity-req', 'inline-proposal-text', 'sec-synopsis', 'sec-scope', 'sec-timeline'];

      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('mouseup', handleTextSelection);
        }
      });

      // Use event delegation for section clicks
      document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.comment-section-wrapper');
        if (wrapper && window.getSelection().toString().trim() === "" && !e.target.closest('.comment-highlight') && !e.target.closest('.section-add-comment-btn')) {
          handleSectionClickEvent(e, wrapper.id);
        }
      });

      document.addEventListener('mousedown', (e) => {
        const popover = document.getElementById('comment-popover');
        if (popover && !popover.contains(e.target) && !e.target.closest('[contenteditable="true"]') && !e.target.closest('.section-comment-indicator') && !e.target.closest('.section-add-comment-btn')) {
          hideCommentPopover();
        }
      });
    }

    function handleSectionClickEvent(e, wrapperId) {
      // Only allow commenting if we are NOT in manager review or client dashboard
      if (e.target.closest('#manager-review-overlay') || e.target.closest('#client-dashboard')) {
        return;
      }

      if (e.stopPropagation) e.stopPropagation();

      let sectionName = "this section";
      if (wrapperId.includes('synopsis')) sectionName = "Executive Synopsis";
      if (wrapperId.includes('scope')) sectionName = "Engagement Scope";
      if (wrapperId.includes('timeline')) sectionName = "Project Timeline";

      currentSelection = {
        isSection: true,
        text: `[Comment on ${sectionName}]`,
        containerId: wrapperId
      };

      const x = e.pageX || e.clientX;
      const y = e.pageY || e.clientY;
      showCommentPopover(x, y, `General Note: ${sectionName}`);
    }

    function handleTextSelection(e) {
      // Only allow commenting if we are NOT in manager review or client dashboard
      if (e.target.closest('#manager-review-overlay') || e.target.closest('#client-dashboard')) {
        return;
      }

      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0) {
        currentSelection = {
          text: text,
          range: selection.getRangeAt(0),
          containerId: e.currentTarget.id
        };

        showCommentPopover(e.pageX, e.pageY, text);
      }
    }

    function showCommentPopover(x, y, text) {
      const popover = document.getElementById('comment-popover');
      const preview = document.getElementById('selected-text-preview');
      const input = document.getElementById('popover-comment-input');

      if (!popover) return;

      // Clear old input
      if (input) input.value = '';

      // Show/hide preview for section vs text selection
      if (preview) {
        const isSection = text.startsWith('General Note:');
        if (isSection) {
          preview.style.display = 'none';
        } else {
          preview.style.display = 'block';
          preview.innerText = `"${text.length > 80 ? text.substring(0, 80) + '...' : text}"`;
        }
      }

      popover.style.display = 'flex';

      // Clamp to viewport so it never goes off screen
      const popoverW = 300;
      const popoverH = 200;
      const maxX = window.innerWidth - popoverW - 16;
      const maxY = window.innerHeight - popoverH - 16;
      const boundedX = Math.max(8, Math.min(x, maxX));
      const boundedY = Math.max(8, Math.min(y - 120, maxY));

      popover.style.left = `${boundedX}px`;
      popover.style.top = `${boundedY}px`;

      // Delay focus so popover renders first
      setTimeout(() => { if (input) input.focus(); }, 50);
    }

    function hideCommentPopover() {
      const popover = document.getElementById('comment-popover');
      if (popover) popover.style.display = 'none';
      const input = document.getElementById('popover-comment-input');
      if (input) input.value = '';
    }

    function saveSelectionComment() {
      const commentInput = document.getElementById('popover-comment-input');
      const commentText = commentInput.value.trim();
      if (!commentText || !currentSelection) return;

      const commentId = 'comment-' + Date.now();

      if (currentSelection.isSection) {
        // Add a visual indicator at the top of the section
        const container = document.getElementById(currentSelection.containerId);
        const indicator = document.createElement('div');
        indicator.className = 'section-comment-indicator';
        indicator.id = commentId;
        indicator.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Partner Note: ${commentText.substring(0, 20)}${commentText.length > 20 ? '...' : ''}
            `;
        container.prepend(indicator);
      } else {
        const span = document.createElement('span');
        span.className = 'comment-highlight';
        span.id = commentId;
        span.innerText = currentSelection.text;

        try {
          currentSelection.range.deleteContents();
          currentSelection.range.insertNode(span);
        } catch (err) {
          console.error("Range insert failed", err);
        }
      }

      const commentObj = {
        id: commentId,
        selectedText: currentSelection.text,
        comment: commentText,
        isSection: currentSelection.isSection || false,
        containerId: currentSelection.containerId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      comments.push(commentObj);
      if (typeof partnerComments !== 'undefined') partnerComments.push(commentObj);

      renderCommentList();
      hideCommentPopover();

      window.getSelection().removeAllRanges();
    }

    function renderCommentList() {
      const list = document.getElementById('pdf-comments-list');
      if (!list) return;

      if (comments.length === 0) {
        list.innerHTML = `<div style="color:#94a3b8; font-size:13px; font-style:italic; padding:16px; border:1px dashed #e2e8f0; border-radius:8px; text-align:center;">Select text in the proposal to add specific review comments.</div>`;
        return;
      }

      list.innerHTML = comments.map(c => `
            <div class="comment-card-item" onclick="scrollToCommentHighlight('${c.id}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="font-weight:700; color:#2563eb;">${c.isSection ? 'Section Note' : 'Partner Note'}</span>
                    <span style="font-size:11px; color:#94a3b8;">${c.timestamp}</span>
                </div>
                ${c.isSection ? '' : `<div class="selected-text-preview">"${c.selectedText}"</div>`}
                <div style="color:#334155; line-height:1.4;">${c.comment}</div>
            </div>
        `).join('');
    }

    function scrollToCommentHighlight(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const originalBg = el.style.backgroundColor;
        el.style.backgroundColor = 'rgba(255, 235, 59, 1)';
        setTimeout(() => {
          el.style.backgroundColor = originalBg || 'rgba(255, 245, 157, 0.6)';
        }, 2000);
      }
    }

    function scrollToManagerHighlight(id) {
      const display = document.getElementById('manager-review-proposal-display');
      if (!display) return;

      const el = display.querySelector('#' + id);
      if (el) {
        // Find the containing section or wrapper to highlight the whole block
        const sectionTarget = el.closest('.comment-section-wrapper') || el.closest('section') || el;

        sectionTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Capture original state
        const originalBg = sectionTarget.style.backgroundColor;
        const originalTransition = sectionTarget.style.transition;

        // Apply Subtle Context Highlight (Light Indigo)
        sectionTarget.style.transition = 'background-color 0.4s ease';
        sectionTarget.style.backgroundColor = '#f5f3ff'; // Light purple/indigo

        setTimeout(() => {
          sectionTarget.style.backgroundColor = originalBg;
          setTimeout(() => {
            sectionTarget.style.transition = originalTransition;
          }, 400);
        }, 2000); // 2 seconds
      }
    }

    function transitionToClientView() {
      // Show handover overlay first
      const clientOv = document.getElementById('client-handover-overlay');
      if (clientOv) {
        clientOv.classList.remove('hidden');
        clientOv.style.display = 'flex';
        void clientOv.offsetWidth; // Repaint
        clientOv.classList.add('show');
        clientOv.style.opacity = '1';

        // Close delivery modal behind it without fading to prevent revealing dashboard
        const dlvOverlay = document.getElementById('delivery-overlay');
        if (dlvOverlay) {
          setTimeout(() => {
            dlvOverlay.style.display = 'none';
            dlvOverlay.classList.add('hidden');
          }, 500); // Once cinematic overlay is black
        }

        setTimeout(() => {
          document.getElementById('client-handover-progress').style.width = '100%';
          document.getElementById('client-handover-badge').style.opacity = '1';
          document.getElementById('client-handover-badge').style.transform = 'translateY(0)';
          
          const title = document.getElementById('client-handover-title');
          title.textContent = '';
          const msg1 = "Proposal package encrypted and securely delivered. Simulating client opening the link...";
          let i = 0;
          let clickReady = false;
          
          const t1 = setInterval(() => {
            title.textContent += msg1[i++];
            if (i >= msg1.length) {
              clearInterval(t1);
              setTimeout(() => {
                document.getElementById('client-handover-msg').textContent = "Link opened. Transitioning to Client Portal...";
                document.getElementById('client-handover-click-hint').style.opacity = '1';
                clientOv.style.cursor = 'pointer';
                clickReady = true;
              }, 600);
            }
          }, 24);

          const advanceToClient = () => {
            if (!clickReady) return;
            clientOv.removeEventListener('click', advanceToClient);
            clientOv.style.cursor = 'default';
            
            // Swap dashboards seamlessly while black
            const dash = document.getElementById('dashboard');
            if (dash) dash.style.display = 'none';
            const clientDash = document.getElementById('client-dashboard');
            if (clientDash) clientDash.classList.remove('hidden');
            prepareClientProposalView();
            
            clientOv.classList.remove('show');
            clientOv.style.opacity = '0';
            setTimeout(() => {
              clientOv.style.display = 'none';
              clientOv.classList.add('hidden');
            }, 400);
          };
          clientOv.addEventListener('click', advanceToClient);

        }, 800);
      } else {
        const dash = document.getElementById('dashboard');
        if (dash) dash.style.display = 'none';

        const clientDash = document.getElementById('client-dashboard');
        if (clientDash) clientDash.classList.remove('hidden');

        prepareClientProposalView();
      }
    }

    function prepareClientProposalView() {
      const display = document.getElementById('client-proposal-display');
      const source = document.getElementById('inline-proposal-text');

      if (!display || !source) return;

      // Sync the full rich proposal from the partner's editor
      display.innerHTML = source.innerHTML;
      display.style.fontFamily = "'Inter', sans-serif";

      // Populate partner comments panel
      const clientCommentsList = document.getElementById('client-comments-list');
      if (clientCommentsList) {
        if (comments.length === 0) {
          clientCommentsList.innerHTML = `
                    <div style="color:#94a3b8; font-size:13px; font-style:italic; text-align:center; padding:20px; border:1px dashed #ddd5fe; border-radius:8px; background:#faf5ff;">
                      No partner notes have been added to this proposal.
                    </div>`;
        } else {
          clientCommentsList.innerHTML = comments.map((c, i) => `
                    <div onclick="scrollToClientHighlight('${c.id}')" style="background:white; border:1px solid #e9d5ff; border-left:3px solid #7c3aed; border-radius:8px; padding:12px 14px; cursor:pointer; transition:all 0.2s;"
                      onmouseover="this.style.background='#faf5ff'; this.style.borderColor='#7c3aed';"
                      onmouseout="this.style.background='white'; this.style.borderColor='#e9d5ff';">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                          <div style="width:18px; height:18px; background:#f3f0ff; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          </div>
                          <span style="font-size:11px; font-weight:700; color:#7c3aed;">${c.isSection ? 'Section Note' : 'Partner Note'}</span>
                        </div>
                        <span style="font-size:10px; color:#94a3b8;">${c.timestamp}</span>
                      </div>
                      ${!c.isSection ? `<div style="font-size:11px; color:#5b21b6; background:#f3f0ff; padding:4px 8px; border-radius:4px; margin-bottom:6px; font-style:italic; line-height:1.4;">"${c.selectedText.length > 50 ? c.selectedText.substring(0, 50) + '...' : c.selectedText}"</div>` : ''}
                      <div style="font-size:12px; color:#334155; line-height:1.5;">${c.comment}</div>
                      <div style="margin-top:8px; font-size:10px; color:#7c3aed; font-weight:600; display:flex; align-items:center; gap:3px;">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Click to locate in document
                      </div>
                    </div>
                `).join('');
        }
      }
    }

    function scrollToClientHighlight(id) {
      const container = document.getElementById('client-proposal-display');
      if (!container) return;

      const el = container.querySelector('#' + id);
      if (el) {
        // Context-aware targeting: highlight the entire section
        const sectionTarget = el.closest('.comment-section-wrapper') || el.closest('section') || el;

        sectionTarget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

        const originalBg = sectionTarget.style.backgroundColor;
        const originalTransition = sectionTarget.style.transition;

        sectionTarget.style.transition = 'background-color 0.4s ease';
        sectionTarget.style.backgroundColor = '#f5f3ff'; // Simple light indigo

        setTimeout(() => {
          sectionTarget.style.backgroundColor = originalBg;
          setTimeout(() => {
            sectionTarget.style.transition = originalTransition;
          }, 400);
        }, 2000); // 2 seconds
      }
    }

    /* ── Toast Notification ── */
    function showToast(message) {
      let toast = document.getElementById('global-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
      }

      toast.innerHTML = `
        <div class="toast-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span>${message}</span>
      `;

      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }

    /* ── Handle redirect from client portal ── */
    (function handlePortalReturn() {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get('data');
      const flowParam = params.get('flow');

      if (!dataParam && flowParam !== 'documents_submitted') return;

      // Clean the URL so refresh doesn't re-trigger
      window.history.replaceState({}, '', window.location.pathname);

      // Hide all potential overlays
      const overlays = [
        'client-reject-overlay',
        'client-sign-overlay',
        'delivery-overlay',
        'onboarding-dispatch-overlay',
        'manager-review-overlay',
        'client-handover-overlay'
      ];
      overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      // Show the main dashboard
      const dash = document.getElementById('dashboard');
      if (dash) {
        dash.style.display = 'grid';
        dash.style.opacity = '1';
      }

      // Handle the specific flow
      if (flowParam === 'documents_submitted') {
        // Switch to the Document Upload Progress view as requested
        const docNav = document.getElementById('nav-doc-upload');
        switchDashboardView('view-doc-upload', docNav);

        updateManagerDashboardWithClientStatus('Documents Submitted');

        // Final polish toast
        setTimeout(() => {
          if (typeof showToast !== 'undefined') {
            showToast('Audit Offshore document portfolio has been successfully ingested and verified.');
          } else {
            alert('Audit Offshore document portfolio has been successfully ingested and verified.');
          }
        }, 800);
      } else if (dataParam === 'received') {
        updateManagerDashboardWithClientStatus('Approved');
      }
    })();


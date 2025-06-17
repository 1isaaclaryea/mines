export interface BudgetEntry {
    year: number;
    month: number;  // 1-12
    data: {
      crushing: {
        dryTonnes: number;
        crusherAvailability: number;
        crusherUtilization: number;
        stockpileClosingBalance: number;
      };
      milling: {
        dryTonnes: number;
        millAvailability: number;
        millUtilization: number;
        grindSize: number;  // (-75um)
        recirculatingLoad: number;
        cycUfFeedToFlash: number;
      };
      grade: {
        millFeedGoldGrade: number;  // g/t
        cycloneUfGoldGrade: number;  // g/t
        millFeedTotalSulphurGrade: number;  // %
        millFeedPyriticSulphur: number;  // %
        millFeedArsenic: number;  // g/t
        flashFeedSulphurGrade: number;  // %
        flashConcSulphurGrade: number;  // %
      };
      recovery: {
        gravityRecovery: number;  // %
        flashFlotationMassPull: number;  // %
        conventionalFlotationMassPull: number;  // %
        overallFlotationMassPull: number;  // %
        flashFlotationGoldRecovery: number;  // %
        convFlotationGoldRecovery: number;  // %
        overallFlotationGoldRecovery: number;  // %
        flashFlotationSulphurRecovery: number;  // %
        convFlotationSulphurRecovery: number;  // %
        overallFlotationSulphurRecovery: number;  // %
        flashFlotationPyriticSulphurRecovery: number;  // %
        convFlotationPyriticSulphurRecovery: number;  // %
        overallFlotationPyriticSulphurRecovery: number;  // %
        cilGoldRecovery: number;  // CIL Gold Recovery
        overallPlantRecovery: number;  // %
        totalSulphurRecovery: number;  // %
      };
      goldPoured: {
        goldPouredOunces: number;  // ozs
        openingGoldInventory: number;  // oz
        closingGoldInventory: number;  // oz
      };
      biox: {
        sulphurOxidation: number;  // %
        grindSize: number;  // (-45um)
      };
      reagentsConsumption: {
        sodiumCyanide: number;
        quicklime: number;
        grindingMedia: number;
        activatedCarbon: number;
        sodiumHydroxide: number;  // Caustic Soda
        hcl: number;  // HCL
        flocullant: number;
        xanthate: number;
        promoter: number;
        copperSulphate: number;
        frother: number;
        fuel: number;
        cement: number;
      };
      waterTreatment: {
        processWaterTreatmentVolume: number;
        ro250Plant: number;
        ro500Plant: number;
        ro140Plant: number;
        stpWtp: number;  // STP WTP
      };
    };
    createdBy: string;  // user ID
    createdAt: Date;
    lastModifiedBy: string;  // user ID
    lastModifiedAt: Date;
    status: 'draft' | 'submitted' | 'approved';
}